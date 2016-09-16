import {App} from "../../ManagementConsole";
import {ICacheContainer} from "../container/ICacheContainer";
import {IAuthorization} from "./IAuthorization";
import {DmrService} from "../dmr/DmrService";
import IQService = angular.IQService;
import {IDmrRequest} from "../dmr/IDmrRequest";
import {isNullOrUndefined, deepGet} from "../../common/utils/Utils";

const module: ng.IModule = App.module("managementConsole.services.security", []);

export class SecurityService {

  static $inject: string[] = ["$q", "dmrService"];

  constructor(private $q: IQService,
              private dmrService: DmrService) {
  }

  getContainerAuthorization(container: ICacheContainer): ng.IPromise<IAuthorization> {
    let deferred: ng.IDeferred<IAuthorization> = this.$q.defer<IAuthorization>();
    let request: IDmrRequest = {
      address: [].concat("profile", container.profile, "subsystem", "datagrid-infinispan", "cache-container", container.name),
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
}

module.service("securityService", SecurityService);
