import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IServerAddress} from "./IServerAddress";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {INewServerInstance} from "./INewServerInstance";
import {IDmrRequest} from "../dmr/IDmrRequest";

const module: ng.IModule = App.module("managementConsole.services.server", []);

export class ServerService {

  static $inject: string[] = ["$q", "dmrService", "launchType"];

  constructor(private $q: ng.IQService, private dmrService: DmrService, private launchType: LaunchTypeService) {
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
    let deferred: ng.IDeferred<string> = this.$q.defer<string>();
    this.getServerStatus(server).then(status => {
      if (status === "STOPPED") {
        deferred.reject();
      } else {
        deferred.resolve(this.dmrService.readAttributeAndResolveExpression({
          address: this.generateAddress(server).concat("interface", "public"),
          name: "inet-address"
        }));
      }
    });
    return deferred.promise;
  }

  getServerView(server: IServerAddress, container: string): ng.IPromise<string[]> {
    let deferred: ng.IDeferred<string[]> = this.$q.defer<string[]>();
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("host", server.host, "server", server.name, "subsystem", "datagrid-infinispan", "cache-container", container),
      name: "members"
    };
    this.dmrService.readAttribute(request).then(
      (response) => deferred.resolve(response.result),
      () => deferred.reject());
    return deferred.promise;
  }

  private generateAddress(server: IServerAddress): string[] {
    return this.launchType.isStandaloneMode() ? [] : [].concat("host", server.host, "server", server.name);
  }

}

module.service("serverService", ServerService);
