import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {ICacheContainer} from "./ICacheContainer";
import {EndpointService} from "../endpoint/EndpointService";
import {ProfileService} from "../profile/ProfileService";
import {ServerGroupService} from "../server-group/ServerGroupService";
import IQService = angular.IQService;
import {IDmrRequest} from "../dmr/IDmrRequest";
import {JGroupsService} from "../jgroups/JGroupsService";
import {UtilsService} from "../utils/UtilsService";

const module: ng.IModule = App.module("managementConsole.services.container", []);

export class ContainerService {

  static $inject: string[] = ["$q", "dmrService", "endpointService", "profileService", "serverGroupService",
    "jGroupsService", "utils"];

  constructor(private $q: IQService, private dmrService: DmrService, private endpointService: EndpointService,
              private profileService: ProfileService, private serverGroupService: ServerGroupService,
              private jGroupsService: JGroupsService, private utils: UtilsService) {
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

  rebalanceContainer(name: string): void {
    // TODO implement
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
