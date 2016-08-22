import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import IPromise = angular.IPromise;
import {IDmrRequest} from "../dmr/IDmrRequest";
import IQService = angular.IQService;

const module:ng.IModule = App.module("managementConsole.services.profile", []);

export class ProfileService {

  static $inject: string[] = ["$q", "dmrService"];

  constructor(private $q: IQService, private dmrService: DmrService) {}

  getAllProfileNames(): IPromise<string[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [],
      "child-type": "profile",
    };
    let deferred: ng.IDeferred<string[]> = this.$q.defer<string[]>();
    this.dmrService.readChildResources(request).then((response) => {
      let profiles: string[] = [];
      for (let key in response) {
        profiles.push(key);
      }
      deferred.resolve(profiles);
    });
    return deferred.promise;
  }
}

module.service("profileService", ProfileService);
