import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import IQService = angular.IQService;

const module: ng.IModule = App.module("managementConsole.services.server", []);

export class ServerService {

  static $inject: string[] = ["$q", "dmrService"];

  constructor(private $q: IQService, private dmrService: DmrService) {}



}

module.service("serverService", ServerService);
