import {App} from "../../ManagementConsole";
import {ICacheContainer} from "../container/ICacheContainer";
import {IAuthorization} from "./IAuthorization";
import {DmrService} from "../dmr/DmrService";
import IQService = angular.IQService;
import {IDmrRequest} from "../dmr/IDmrRequest";
import {isNullOrUndefined, deepGet} from "../../common/utils/Utils";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {IServerAddress} from "../server/IServerAddress";
import {ServerGroupService} from "../server-group/ServerGroupService";
import {JGroupsService} from "../jgroups/JGroupsService";
import {IServerGroup} from "../server-group/IServerGroup";

const module: ng.IModule = App.module("managementConsole.services.security", []);

export class SecurityService {

  static $inject: string[] = ["$q", "dmrService", "launchType", "serverGroupService", "jGroupsService"];

  constructor(private $q: IQService,
              private dmrService: DmrService,
              private launchType: LaunchTypeService,
              private serverGroupService: ServerGroupService,
              private jGroupsService: JGroupsService) {
  }

  getContainerAuthorization(container: ICacheContainer): ng.IPromise<IAuthorization> {
    let deferred: ng.IDeferred<IAuthorization> = this.$q.defer<IAuthorization>();
    let request: IDmrRequest = {
      address: this.getDatagridAddress(container.profile).concat("cache-container", container.name),
      "child-type": "security",
      recursive: true
    };

    this.dmrService.readChildResources(request)
      .then(response => {
        let auth: any = deepGet(response, "SECURITY.authorization.AUTHORIZATION");
        if (isNullOrUndefined(response) || isNullOrUndefined(auth)) {
          deferred.resolve(undefined);
        } else {
          let authorization: IAuthorization = {
            "audit-logger": auth["audit-logger"],
            mapper: auth.mapper,
            roles: []
          };

          angular.forEach(auth.role, (role, roleName) => {
            authorization.roles.push({
              name: roleName,
              permissions: role.permissions
            });
          });
          deferred.resolve(authorization);
        }
      }, error => deferred.reject(error));
    return deferred.promise;
  }

  getSecurityRealms(): ng.IPromise<string[]> {
    return this.serverGroupService.getAllServerGroupsMap().then(groups => {
      for (let group in groups) {
        // get the realms for the first server group as they are shared across groups
        return this.serverGroupService.getServerGroupMapWithMembers(group).then(serverGroup => {
          return this.getSecurityRealmsForServerGroup(serverGroup);
        });
      }
    });
  }

  getSecurityRealmsForServerGroup(serverGroup: IServerGroup): ng.IPromise<string[]> {
    let deferred: ng.IDeferred<string[]> = this.$q.defer<string[]>();
    let securityRealms: string [] = [];
    this.jGroupsService.getServerGroupCoordinator(serverGroup).then(coord => {
      let request: IDmrRequest = {
        address: this.getServerAddress(coord).concat("core-service", "management"),
        "child-type": "security-realm",
        recursive: false
      };

      this.dmrService.readChildResources(request)
        .then(realms => {
          for (let realm in realms) {
            securityRealms.push(realm);
          }
          deferred.resolve(securityRealms);
        });
    });
    return deferred.promise;
  }

  private getDatagridAddress(profile: string): string[] {
    let endpointPath: string[] = ["subsystem", "datagrid-infinispan"];
    return this.launchType.getProfilePath(profile).concat(endpointPath);
  }

  private getServerAddress(server: IServerAddress): string[] {
    return this.launchType.getRuntimePath(server);
  }
}

module.service("securityService", SecurityService);
