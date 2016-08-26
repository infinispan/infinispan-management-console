import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {ICacheContainer} from "./ICacheContainer";
import {EndpointService} from "../endpoint/EndpointService";
import {ProfileService} from "../profile/ProfileService";
import {ServerGroupService} from "../server-group/ServerGroupService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {JGroupsService} from "../jgroups/JGroupsService";
import {UtilsService} from "../utils/UtilsService";
import {DomainService} from "../domain/DomainService";
import {IServerAddress} from "../server/IServerAddress";
import {IServerGroup} from "../server-group/IServerGroup";
import IQService = angular.IQService;

const module: ng.IModule = App.module("managementConsole.services.container", []);

export class ContainerService {

  static $inject: string[] = ["$q", "dmrService", "endpointService", "profileService", "serverGroupService",
    "jGroupsService", "domainService", "utils"];

  constructor(private $q: IQService, private dmrService: DmrService, private endpointService: EndpointService,
              private profileService: ProfileService, private serverGroupService: ServerGroupService,
              private jGroupsService: JGroupsService, private domainService: DomainService,
              private utils: UtilsService) {
  }

  getAllContainers(): ng.IPromise<ICacheContainer[]> {
    let deferred: ng.IDeferred<ICacheContainer[]> = this.$q.defer<ICacheContainer[]>();

    this.profileService.getAllProfileNames()
      .then((profiles) => {
        let promises: ng.IPromise<ICacheContainer[]>[] = [];
        for (let profileName of profiles) {
          promises.push(this.getAllCacheContainersByProfile(profileName));
        }
        return this.$q.all(promises);
      })
      .then((containers: [ICacheContainer[]]) => {
        let allContainers: ICacheContainer[] = containers.reduce((a, b) => a.concat(b));
        deferred.resolve(allContainers);
      });
    return deferred.promise;
  }

  getContainer(name: string, profile: string): ng.IPromise<ICacheContainer> {
    let deferred: ng.IDeferred<ICacheContainer> = this.$q.defer<ICacheContainer>();
    let container: ICacheContainer = <ICacheContainer> {
      name: name,
      profile: profile
    };

    this.serverGroupService.getServerGroupByProfile(profile)
      .then((serverGroup) => {
        container.serverGroup = serverGroup;
        return this.endpointService.getAllEndpoints(profile, serverGroup["socket-binding-group"]);
      })
      .then((endpoints) => {
        container.endpoints = endpoints;
        return this.getNumberOfCachesInContainer(container.profile, container.name);
      })
      .then((numberOfCaches) => {
        container.numberOfCaches = numberOfCaches;
        return this.isContainerAvailable(container.name, container.serverGroup);
      })
      .then((available) => {
        container.available = available;
        return this.getSiteArrays(container);
      })
      .then((sites) => {
        for (let siteType in sites) {
          container[siteType] = sites[siteType];
        }
        deferred.resolve(container);
      });

    return deferred.promise;
  }

  getCacheContainerNames(profile: string): ng.IPromise<string[]> {
    let deferred: ng.IDeferred<string[]> = this.$q.defer<string[]>();
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("profile", profile, "subsystem", "datagrid-infinispan"),
      "child-type": "cache-container"
    };

    this.dmrService.readChildResources(request)
      .then((containers) => {
        let containerNames: string[] = [];
        for (let container in containers) {
          containerNames.push(container);
        }
        deferred.resolve(containerNames);
      });
    return deferred.promise;
  }

  getAllCacheContainersByProfile(profile: string): ng.IPromise<ICacheContainer[]> {
    return this.getCacheContainerNames(profile)
      .then((containerNames) => {
        let promises: ng.IPromise<ICacheContainer>[] = [];

        for (let containerName of containerNames) {
          promises.push(this.getContainer(containerName, profile));
        }

        return this.$q.all(promises);
      });
  }

  getNumberOfCachesInContainer(profile: string, container: string): ng.IPromise<number> {
    let deferred: ng.IDeferred<number> = this.$q.defer<number>();
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("profile", profile, "subsystem", "datagrid-infinispan", "cache-container", container)
    };

    this.dmrService.readResource(request)
      .then((response) => {
        let cacheTypes: string[] = ["distributed-cache", "replicated-cache", "local-cache", "invalidation-cache"];
        deferred.resolve(this.countNumberOfCaches(response, cacheTypes));
      });
    return deferred.promise;
  }

  isContainerAvailable(name: string, serverGroup: IServerGroup): ng.IPromise<boolean> {
    let deferred: ng.IDeferred<boolean> = this.$q.defer<boolean>();
    let promises: ng.IPromise<string[]>[] = [];

    for (let server of serverGroup.members) {
      promises.push(this.domainService.getServerView(server, name));
    }

    this.$q.all(promises).then((views: [string[]]) => {
      if (views.length === 1) {
        deferred.resolve(true);
        return;
      }
      let firstView: string[] = views[0];
      deferred.resolve(views.every((view) => view === firstView));
    });
    return deferred.promise;
  }

  getSiteArrays(container: ICacheContainer): ng.IPromise<{[id: string]: string[]}> {
    let deferred: ng.IDeferred<{[id: string]: string[]}> = this.$q.defer<{[id: string]: string[]}>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup).then((coordinator) => {
      deferred.resolve(this.$q.all({
        "sites-online": this.getSite("sites-online", coordinator, container.name),
        "sites-offline": this.getSite("sites-offline", coordinator, container.name),
        "sites-mixed": this.getSite("sites-mixed", coordinator, container.name)
      }));
    });
    return deferred.promise;
  }

  rebalanceContainer(name: string): void {
    // TODO implement
  }

  private getSite(type: string, server: IServerAddress, container: string): ng.IPromise<string[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("host", server.host, "server", server.name, "subsystem", "datagrid-infinispan", "cache-container", container),
      name: type
    };
    return this.dmrService.readAttribute(request);
  }

  private countNumberOfCaches(object: any, cacheTypes: string[]): number {
    let numberOfCaches: number = 0;
    for (let cache of cacheTypes) {
      if (this.utils.isNotNullOrUndefined(object[cache])) {
        numberOfCaches += Object.keys(object[cache]).length;
      }
    }
    return numberOfCaches;
  }
}

module.service("containerService", ContainerService);
