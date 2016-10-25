import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import IQService = angular.IQService;

const module: ng.IModule = App.module("managementConsole.services.standalone", []);

export class StandaloneService {

  public static PROFILE_NAME: string = "standalone";
  public static SERVER_GROUP: string = "default";

  static $inject: string[] = ["$q", "dmrService"];

  constructor(private $q: IQService,
              private dmrService: DmrService) {
  }
}

module.service("standaloneService", StandaloneService);
