import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {ICounter} from "./ICounter";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {SocketBindingService} from "../socket-binding/SocketBindingService";
import IQService = angular.IQService;
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {isNotNullOrUndefined, traverse, deepValue} from "../../common/utils/Utils";
import {ICacheContainer} from "../container/ICacheContainer";
import {JGroupsService} from "../jgroups/JGroupsService";
import {IServerAddress} from "../server/IServerAddress";
import {WeakCounter} from "./WeakCounter";
import {StrongCounter} from "./StrongCounter";

const module: ng.IModule = App.module("managementConsole.services.counter", []);

export const STRONG_COUNTER: string = "STRONG";
export const WEAK_COUNTER: string = "WEAK";
export const COUNTER_TYPES: string [] = ["STRONG", "WEAK"];
export const COUNTER_STORAGE_TYPES: string [] = ["PERSISTENT", "VOLATILE"];

export class CounterService {
  static $inject: string[] = ["$q", "jGroupsService", "dmrService", "socketBindingService", "launchType"];

  constructor(private $q: IQService, private jGroupsService: JGroupsService, private dmrService: DmrService,
              private socketBindingService: SocketBindingService, private launchType: LaunchTypeService) {
  }

  doCountersExist(cacheContainer: string, profile: string): ng.IPromise<boolean> {
    let deferred: ng.IDeferred<boolean> = this.$q.defer<boolean>();
    let request: IDmrRequest = {
      address: this.getCountersConfigurationAddress(cacheContainer, profile)
    };
    this.dmrService.readResource(request).then(r => deferred.resolve(true), e => deferred.resolve(false));
    return deferred.promise;
  }

  createCountersDMRPath(cacheContainer: string, profile: string): ng.IPromise<any> {
    return this.dmrService.add({
      address: this.getCountersConfigurationAddress(cacheContainer, profile)
    });
  }

  getAllCounters(container: ICacheContainer): ng.IPromise<ICounter[]> {
    return this.doCountersExist(container.name, container.profile).then(countersExist => {
      if (countersExist) {
        return this.getAllCountersHelper(container);
      } else {
        return [];
      }
    });
  }

  getAllCountersHelper(cacheContainer: ICacheContainer): ng.IPromise<ICounter[]> {
    let request: IDmrRequest;
    let deferred: ng.IDeferred<ICounter[]> = this.$q.defer<ICounter[]>();
    if (this.launchType.isStandaloneMode()) {
      request = <IDmrRequest>{
        address: this.getCountersRuntimeAddress(cacheContainer.name),
        "recursive-depth": 2,
        "include-runtime": true
      };
      this.findCounters(request).then(counters => {
        deferred.resolve(counters);
      });
    } else {
      this.jGroupsService.getServerGroupCoordinator(cacheContainer.serverGroup).then((coord: IServerAddress) => {
        request = <IDmrRequest>{
          address: this.getCountersRuntimeAddress(cacheContainer.name, coord.host, coord.name),
          "recursive-depth": 2,
          "include-runtime": true
        };
        this.findCounters(request).then(counters => {
          deferred.resolve(counters);
        });
      });
    }
    return deferred.promise;
  }

  findCounters(request: IDmrRequest): ng.IPromise<ICounter[]> {
    return this.dmrService.readResource(request).then((response: any) => {
      let counters: ICounter[] = [];
      let trail: String [] = [];
      traverse(response, (key: string, value: string, trail: string []) => {
        let traversingCounterObject: boolean = (key === "name");
        if (traversingCounterObject) {
          let counter: any = deepValue(response, trail);
          let type: string = trail[0];
          if (isNotNullOrUndefined(counter) && type === "strong-counter") {
            counters.push(new StrongCounter(counter.name, counter.storage, counter["initial-value"],
              counter.value, counter["lower-bound"], counter["upper-bound"]));
          } else if (isNotNullOrUndefined(counter) && type === "weak-counter") {
            counters.push(new WeakCounter(counter.name, counter.storage, counter["initial-value"],
              counter.value, counter.concurrency));
          }
        }
      }, trail);
      return counters;
    });
  }

  create(counter: ICounter, profile: string, container: string): ng.IPromise<any> {
    counter["is-new-node"] = true;
    return this.doCountersExist(container, profile).then((countersExists: boolean) => {
      if (countersExists) {
        return this.createHelper(counter, profile, container);
      } else {
        return this.createCountersDMRPath(container, profile).then(result => {
          return this.createHelper(counter, profile, container);
        });
      }
    });
  }

  reset(container: ICacheContainer, counter: ICounter): ng.IPromise<any> {
    if (this.launchType.isStandaloneLocalMode()) {
      return this.dmrService.executePost({
        address: this.getCounterRuntimeAddress(counter, container.name),
        operation: "counter-reset"
      });
    } else {
      return this.jGroupsService.getServerGroupCoordinator(container.serverGroup).then((coord: IServerAddress) => {
        return this.dmrService.executePost({
          address: this.getCounterRuntimeAddress(counter, container.name, coord.host, coord.name),
          operation: "counter-reset"
        });
      });
    }
  }

  remove(container: ICacheContainer, counter: ICounter): ng.IPromise<any> {
    return this.dmrService.executePost({
      address: this.getCounterAddress(counter, container.name, container.profile),
      operation: "remove"
    });
  }

  private createHelper(counter: ICounter, profile: string, container: string): ng.IPromise<any> {
    let request: IDmrRequest;
    if (counter instanceof StrongCounter) {
      let strongCounter: StrongCounter = <StrongCounter> counter;
      request = <IDmrRequest> {
        address: this.getCounterAddress(counter, container, profile),
        name: strongCounter.getName(),
        storage: strongCounter.getStorage(),
        "initial-value": strongCounter.getInitialValue(),
        "lower-bound": strongCounter.getLowerBound(),
        "upper-bound": strongCounter.getUpperBound()
      };
    } else {
      let weakCounter: WeakCounter = <WeakCounter> counter;
      request = <IDmrRequest> {
        address: this.getCounterAddress(counter, container, profile),
        name: weakCounter.getName(),
        storage: weakCounter.getStorage(),
        "initial-value": weakCounter.getInitialValue(),
        "concurrency": weakCounter.getConcurrency()
      };
    }
    return this.dmrService.add(request);
  }

  private getCounterAddress(c: ICounter, container: string, profile?: string): string[] {
    return this.getCountersConfigurationAddress(container, profile)
      .concat(c instanceof StrongCounter ? "strong-counter" : "weak-counter")
      .concat(c.getName());
  }

  private getContainerAddress(container: string, preappendPath: string []): string[] {
    let address: string[] = preappendPath;
    return address.concat("subsystem", "datagrid-infinispan", "cache-container", container);
  }

  private getCountersConfigurationAddress(container: string, profile?: string): string[] {
    let address: string [] = this.launchType.isDomainMode() ? [].concat("profile", profile) : [];
    return this.getContainerAddress(container, address).concat("counters", "COUNTERS");
  }

  private getCountersRuntimeAddress(container: string, host?: string, server?: string): string[] {
    let path: string [] = this.launchType.isStandaloneMode() ? [] : [].concat("host", host).concat("server", server);
    return this.getContainerAddress(container, path).concat("counters", "COUNTERS");
  }

  private getCounterRuntimeAddress(c: ICounter, container: string, host?: string, server?: string): string[] {
    let path: string [] = this.launchType.isStandaloneMode() ? [] : [].concat("host", host).concat("server", server);
    return this.getContainerAddress(container, path).concat("counters", "COUNTERS")
      .concat(c instanceof StrongCounter ? "strong-counter" : "weak-counter")
      .concat(c.getName());
  }

}

module.service("counterService", CounterService);
