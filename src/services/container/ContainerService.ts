import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {ICacheContainer} from "./ICacheContainer";
import {EndpointService} from "../endpoint/EndpointService";
import {ProfileService} from "../profile/ProfileService";
import {ServerGroupService} from "../server-group/ServerGroupService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {JGroupsService} from "../jgroups/JGroupsService";
import {DomainService} from "../domain/DomainService";
import {IServerAddress} from "../server/IServerAddress";
import {IServerGroup} from "../server-group/IServerGroup";
import {ServerService} from "../server/ServerService";
import {CacheService} from "../cache/CacheService";
import IQService = angular.IQService;
import {SecurityService} from "../security/SecurityService";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";

const module: ng.IModule = App.module("managementConsole.services.container", []);

export class ContainerService {

  static $inject: string[] = ["$q", "dmrService", "endpointService", "profileService", "serverGroupService",
    "jGroupsService", "domainService", "serverService", "cacheService", "securityService", "launchType"];

  constructor(private $q: IQService,
              private dmrService: DmrService,
              private endpointService: EndpointService,
              private profileService: ProfileService,
              private serverGroupService: ServerGroupService,
              private jGroupsService: JGroupsService,
              private domainService: DomainService,
              private serverService: ServerService,
              private cacheService: CacheService,
              private securityService: SecurityService,
              private launchType: LaunchTypeService) {
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
      .then(serverGroup => {
        container.serverGroup = serverGroup;
        return this.endpointService.getAllEndpoints(profile, serverGroup["socket-binding-group"]);
      })
      .then(endpoints => {
        container.endpoints = endpoints;
        return this.securityService.getContainerAuthorization(container);
      })
      .then(authorization => {
        container.authorization = authorization;
        return this.cacheService.getAllCachesInContainer(container);
      })
      .then(caches => {
        container.numberOfCaches = caches.length;
        return this.isContainerAvailable(container.name, container.serverGroup);
      })
      .then(available => {
        container.available = available;
        if (!available) {
          deferred.resolve(container);
          return;
        }
        if (this.jGroupsService.hasJGroupsStack()) {
          return this.getSiteArrays(container);
        } else {
          deferred.resolve(container);
          return;
        }
      })
      .then(sites => {
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
      address: this.getContainerSubsystemAddress(profile),
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

  isContainerAvailable(name: string, serverGroup: IServerGroup): ng.IPromise<boolean> {
    let deferred: ng.IDeferred<boolean> = this.$q.defer<boolean>();
    let statusPromises: ng.IPromise<string>[] = [];

    for (let server of serverGroup.members) {
      statusPromises.push(this.serverService.getServerStatus(server));
    }

    // Get the status of all nodes in a server group, if a node is stopeed then the container is not available
    // Otherwise, ensure that the views of all nodes within the server group are the same. Is this second step necessary?
    this.$q.all(statusPromises)
      .then((statuses: string[]) => {
        return statuses.indexOf("STOPPED") === -1;
      })
      .then((allServersRunning) => {
        if (allServersRunning) {
          let viewPromisies: ng.IPromise<string[]>[] = [];
          for (let server of serverGroup.members) {
            viewPromisies.push(this.serverService.getServerView(server, name));
          }

          this.$q.all(viewPromisies)
            .then((views: [string[]]) => {
              if (views.length === 0 || views.length === 1) {
                deferred.resolve(true);
                return;
              }
              let firstView: string[] = views[0];
              let allViewsEqual: boolean = views.every((view) => JSON.stringify(view) === JSON.stringify(firstView));
              deferred.resolve(allViewsEqual);
            });

        } else {
          deferred.resolve(false);
        }
      });
    return deferred.promise;
  }

  getSiteArrays(container: ICacheContainer): ng.IPromise<{[id: string]: string[]}> {
    let deferred: ng.IDeferred<{[id: string]: string[]}> = this.$q.defer<{[id: string]: string[]}>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
      .then(coordinator => {
        deferred.resolve(this.$q.all({
          "sites-online": this.getSite("sites-online", coordinator, container),
          "sites-offline": this.getSite("sites-offline", coordinator, container),
          "sites-mixed": this.getSite("sites-mixed", coordinator, container)
        }));
      }, error => deferred.reject(error));
    return deferred.promise;
  }

  executeSiteOperation(operation: string, siteName: string, container: ICacheContainer): ng.IPromise<void> {
    let deferred: ng.IDeferred<void> = this.$q.defer<void>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
      .then(coordinator => {
        deferred.resolve(this.dmrService.executePost({
          operation: operation,
          address: this.getContainerAddress(container, coordinator),
          "site-name": siteName
        }));
      }, error => deferred.reject(error));
    return deferred.promise;
  }

  isRebalancingEnabled(container: ICacheContainer): ng.IPromise<boolean> {
    let deferred: ng.IDeferred<boolean> = this.$q.defer<boolean>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup).then(coordinator => {
      let request: IDmrRequest = {
        address: this.getContainerAddress(container, coordinator),
        name: "cluster-rebalance"
      };
      this.dmrService.readAttribute(request).then(response => deferred.resolve(Boolean(response)));
    }, (error) => deferred.resolve(true)); // LOCAL mode, switch it to true as we don't care
    return deferred.promise;
  }

  disableRebalance(container: ICacheContainer): ng.IPromise<void> {
    return this.setRebalanceAllowed(false, container);
  }

  enableRebalance(container: ICacheContainer): ng.IPromise<void> {
    return this.setRebalanceAllowed(true, container);
  }

  rebalanceContainer(name: string): void {
    // TODO implement
  }

  private setRebalanceAllowed(enabled: boolean, container: ICacheContainer): ng.IPromise<void> {
    let deferred: ng.IDeferred<void> = this.$q.defer<void>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
      .then(coordinator => {
          let request: IDmrRequest = {
            operation: "cluster-rebalance",
            address: this.getContainerAddress(container, coordinator),
            value: String(enabled)
          };
          this.dmrService.executePost(request).then(() => deferred.resolve());
        },
        error => deferred.reject(error));
    return deferred.promise;
  }

  private getSite(type: string, server: IServerAddress, container: ICacheContainer): ng.IPromise<string[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: this.getContainerAddress(container, server),
      name: type
    };
    return this.dmrService.readAttribute(request);
  }

  private getContainerAddress(container: ICacheContainer, coordinator: IServerAddress): string[] {
    let containerPath: string[] = ["subsystem", "datagrid-infinispan", "cache-container", container.name];
    return this.launchType.getRuntimePath(coordinator).concat(containerPath);
  }

  private getContainerSubsystemAddress(profile: string): string[] {
    let containerPath: string[] = ["subsystem", "datagrid-infinispan"];
    return this.launchType.getProfilePath(profile).concat(containerPath);
  }
}

module.service("containerService", ContainerService);
