import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IServerAddress} from "./IServerAddress";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {INewServerInstance} from "./INewServerInstance";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {IServer} from "../server/IServer";
import {Server} from "../server/Server";
import {StandaloneService} from "../standalone/StandaloneService";

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

  startServer(server: IServerAddress): ng.IPromise<string> {
    return this.dmrService.executePost({
      operation: "start",
      address: [].concat("host", server.host, "server-config", server.name),
      blocking: true
    }, true);
  }

  stopServer(server: IServerAddress): ng.IPromise<string> {
    return this.dmrService.executePost({
      operation: "stop",
      address: [].concat("host", server.host, "server-config", server.name),
      blocking: true
    }, true);
  }

  removeServer(server: IServerAddress): ng.IPromise<string> {
    return this.dmrService.executePost({
      operation: "remove",
      address: [].concat("host", server.host, "server-config", server.name),
      blocking: true
    }, true);
  }

  getServerStatus(server: IServerAddress): ng.IPromise<string> {
    return this.dmrService.readAttribute({
      address: this.generateAddress(server),
      name: "server-state"
    });
  }

  getServer(serverAddress: IServerAddress): ng.IPromise<IServer> {
    let deferred: ng.IDeferred<IServer> = this.$q.defer<IServer>();
    this.dmrService.readResource({
      address: this.generateAddress(serverAddress),
      "include-runtime": true
    }).then(server => {
      deferred.resolve(this.makeServer(serverAddress, server));
    });
    return deferred.promise;
  }

  getServerInetAddress(server: IServerAddress): ng.IPromise<string> {
    let deferred: ng.IDeferred<string> = this.$q.defer<string>();
    this.getServerStatus(server).then(status => {
      if (status === "STOPPED") {
        deferred.reject("It is not possible to connect to server '" + server.toString() + "' as it is stopped");
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
      address: this.generateAddress(server).concat("subsystem", "datagrid-infinispan", "cache-container", container),
      name: "members"
    };
    this.dmrService.readAttribute(request).then((response) => {
        if (response === "N/A") {
          deferred.resolve([]);
        } else {
          if (response) {
            let members: string = response.slice(1, -1);
            let membersArray: string [] = members.split(",");
            let trimmedArray: string [] = [];
            for (let member of membersArray) {
              trimmedArray.push(member.trim());
            }
            deferred.resolve(trimmedArray);
          }
        }
      },
      () => deferred.reject());
    return deferred.promise;
  }

  isStandaloneClustered(): ng.IPromise<boolean> {
    let deferred: ng.IDeferred<boolean> = this.$q.defer<boolean>();
    if (this.launchType.isStandaloneMode()) {
      let request: IDmrRequest = <IDmrRequest>{
        address: [].concat("subsystem", "datagrid-jgroups"),
      };
      this.dmrService.readChildResources(request).then((response) => {
        console.log("Response is " + response);
        deferred.resolve(true);
      });
    } else {
      deferred.resolve(false);
    }
    return deferred.promise;
  }

  isStandaloneLocal(): ng.IPromise<boolean> {
    let deferred: ng.IDeferred<boolean> = this.$q.defer<boolean>();
    if (this.launchType.isStandaloneMode()) {
      let request: IDmrRequest = <IDmrRequest>{
        address: [].concat("subsystem", "datagrid-jgroups"),
      };
      this.dmrService.readChildResources(request).then((response) => {
        console.log("Response is " + response);
        deferred.resolve(true);
      });
    } else {
      deferred.resolve(false);
    }
    return deferred.promise;
  }

  getServerStats(server: IServerAddress): ng.IPromise<any> {
    let deferred: ng.IDeferred<string[]> = this.$q.defer<string[]>();
    this.getServerStatus(server).then(status => {
      if (status === "STOPPED") {
        deferred.reject("It is not possible to connect to server '" + server.toString() + "' as it is stopped");
      } else {
        let request: IDmrRequest = <IDmrRequest>{
          address: this.generateAddress(server).concat("core-service", "platform-mbean"),
          recursive: true,
          "child-type": "type",
          "include-runtime": true,
          "recursive-depth": 2
        };
        this.dmrService.readChildResources(request).then(
          (response) => deferred.resolve(response),
          () => deferred.reject());
      }
    });
    return deferred.promise;
  }

  getAggregateNodeStats(server: IServerAddress): ng.IPromise<string[]> {
    let deferred: ng.IDeferred<string[]> = this.$q.defer<string[]>();
    this.getServerStatus(server).then(status => {
      if (status === "STOPPED") {
        deferred.reject("It is not possible to connect to server '" + server.toString() + "' as it is stopped");
      } else {
        let request: IDmrRequest = <IDmrRequest>{
          address: this.generateAddress(server).concat("subsystem", "datagrid-infinispan", "cache-container"),
          "include-runtime": true,
          recursive: true
        };
        this.dmrService.readResource(request).then(
          (response) => deferred.resolve(response),
          () => deferred.reject());
      }
    });
    return deferred.promise;
  }

  private generateAddress(server: IServerAddress): string[] {
    return this.launchType.getRuntimePath(server);
  }

  private makeServer(address: IServerAddress, server: any): ng.IPromise<IServer> {
    let deferred: ng.IDeferred<IServer> = this.$q.defer<IServer>();
    let serverState: string = server["server-state"].toUpperCase();
    let serverGroupName: string = this.launchType.isDomainMode() ? server["server-group"] : StandaloneService.SERVER_GROUP;
    let serverProfileName: string = this.launchType.isDomainMode() ? server["profile-name"] : StandaloneService.PROFILE_NAME;

    if (serverState === "STOPPED") {
      deferred.resolve(new Server(address, serverState, "", serverProfileName, serverGroupName));
    } else {
      this.dmrService.readAttributeAndResolveExpression({
        address: this.generateAddress(server).concat("interface", "public"),
        name: "inet-address"
      }).then(inetAddress => {
        deferred.resolve(new Server(server, serverState, inetAddress, serverProfileName, serverGroupName));
      });
    }
    return deferred.promise;
  }

}

module.service("serverService", ServerService);
