import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IServerAddress} from "./IServerAddress";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";

const module: ng.IModule = App.module("managementConsole.services.server", []);

export class ServerService {

  static $inject: string[] = ["dmrService", "launchType"];

  constructor(private dmrService: DmrService, private launchType: LaunchTypeService) {
  }

  getServerStatus(server: IServerAddress): ng.IPromise<string> {
    let request: IDmrRequest = {
      address: this.generateAddress(server),
      name: "server-state"
    };
    return this.dmrService.readAttribute(request);
  }

  getServerInetAddress(server: IServerAddress): ng.IPromise<string> {
    let request: IDmrRequest = {
      address: this.generateAddress(server).concat("interface", "public"),
      name: "inet-address"
    };
    return this.dmrService.readAttributeAndResolveExpression(request);
  }

  private generateAddress(server: IServerAddress): string[] {
    return this.launchType.isStandaloneMode() ? [] : [].concat("host", server.host, "server", server.name);
  }

}

module.service("serverService", ServerService);
