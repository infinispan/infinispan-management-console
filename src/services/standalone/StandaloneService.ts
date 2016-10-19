import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import IQService = angular.IQService;
import {IDmrRequest} from "../dmr/IDmrRequest";

const module: ng.IModule = App.module("managementConsole.services.standalone", []);

export class StandaloneService {

  public static PROFILE_NAME: string = "standalone";
  public static SERVER_GROUP: string = "default";

  static $inject: string[] = ["$q", "dmrService"];

  public isClustered: boolean;

  constructor(private $q: IQService,
              private dmrService: DmrService) {
    this.hasCluster().then((result) => {
      this.isClustered = result;
    });
  }
  private hasCluster(): ng.IPromise<boolean> {
    let deferred: ng.IDeferred<boolean> = this.$q.defer<boolean>();
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("subsystem", "datagrid-jgroups")
    };
    this.dmrService.readChildResources(request).then((response) => {
      deferred.resolve(true);
    }).catch(() => {
      deferred.resolve(false);
    });
    return deferred.promise;
  }
}

module.service("standaloneService", StandaloneService);
