import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IServerAddress} from "./IServerAddress";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {INewServerInstance} from "./INewServerInstance";

const module: ng.IModule = App.module("managementConsole.services.server", []);

export class ServerService {

  static $inject: string[] = ["dmrService", "launchType"];

  constructor(private dmrService: DmrService, private launchType: LaunchTypeService) {
  }

  createServer(server: INewServerInstance): ng.IPromise<void> {
    return this.dmrService.add({
      "auto-start": false,
      address: [].concat("host", server.address.host, "server-config", server.address.name),
      "group": server["server-group"],
      "socket-binding-group": server["socket-binding-group"],
      "socket-binding-port-offset": server.portOffset
    });
  }

  startServer(server: INewServerInstance): ng.IPromise<string> {
    return this.dmrService.executePost({
      operation: "start",
      address: [].concat("host", server.address.host, "server-config", server.address.name),
      blocking: true
    }, true);
  }

  getServerStatus(server: IServerAddress): ng.IPromise<string> {
    return this.dmrService.readAttribute({
      address: this.generateAddress(server),
      name: "server-state"
    });
  }

  getServerInetAddress(server: IServerAddress): ng.IPromise<string> {
    return this.dmrService.readAttributeAndResolveExpression({
      address: this.generateAddress(server).concat("interface", "public"),
      name: "inet-address"
    });
  }

  private generateAddress(server: IServerAddress): string[] {
    return this.launchType.isStandaloneMode() ? [] : [].concat("host", server.host, "server", server.name);
  }

}

module.service("serverService", ServerService);
