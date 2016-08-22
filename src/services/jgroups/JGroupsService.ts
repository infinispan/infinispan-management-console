import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import IQService = angular.IQService;
import {IDmrRequest} from "../dmr/IDmrRequest";

const module: ng.IModule = App.module("managementConsole.services.jgroups", []);

export class JGroupsService {

  static $inject: string[] = ["$q", "dmrService"];

  constructor(private $q: IQService, private dmrService: DmrService) {}

  getDefaultStack(host?: string, server?: string): ng.IPromise<string> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("host", host, "server", server, "subsystem", "datagrid-jgroups"),
      name: "default-stack"
    };
    return this.dmrService.readAttributeAndResolveExpression(request);
  }

}

module.service("jGroupsService", JGroupsService);
