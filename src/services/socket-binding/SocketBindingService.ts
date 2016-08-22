import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import IQService = angular.IQService;
import {ISocketBinding} from "./ISocketBinding";

const module: ng.IModule = App.module("managementConsole.services.socket-binding", []);

export class SocketBindingService {
  static $inject: string[] = ["$q", "dmrService", "launchType"];

  static parseSocketBinding(object: any): ISocketBinding {
    return <ISocketBinding> {
      "fixed-port": object["fixed-port"],
      "multicast-address": object["multicast-address"],
      "multicast-port": object["multicast-port"],
      name: object.name,
      port: object.port
    };
  }

  constructor(private $q: IQService, private dmrService: DmrService, private launchType: LaunchTypeService) {}

  getAllSocketBindingGroups(): ng.IPromise<String[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [],
      "child-type": "socket-binding-group"
    };
    let deferred: ng.IDeferred<String[]> = this.$q.defer<String[]>();
    this.dmrService.readChildResources(request).then((response) => {
      let groups: string[] = [];
      for (let name in response) {
        groups.push(name);
      }
      deferred.resolve(groups);
    });
    return deferred.promise;
  }

  getAllSocketBindingsInGroup(socketBindingGroup: string): ng.IPromise<ISocketBinding[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("socket-binding-group", socketBindingGroup),
      recursive: true,
      "child-type": "socket-binding"
    };
    let deferred: ng.IDeferred<ISocketBinding[]> = this.$q.defer<ISocketBinding[]>();
    this.dmrService.readChildResources(request).then((response) => {
      let bindings: ISocketBinding[] = [];
      for (let name in response) {
        let binding: ISocketBinding = SocketBindingService.parseSocketBinding(response[name]);
        bindings.push(binding);
      }
      deferred.resolve(bindings);
    });
    return deferred.promise;
  }

  getSocketBinding(name: string, socketBindingGroup: string): ng.IPromise<ISocketBinding> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("socket-binding-group", socketBindingGroup, "socket-binding", name)
    };

    let deferred: ng.IDeferred<any> = this.$q.defer<any>();
    this.dmrService.readResource(request).then(
      (response) => deferred.resolve(SocketBindingService.parseSocketBinding(response)),
      (msg) => deferred.reject());

    return deferred.promise;
  }
}

module.service("socketBindingService", SocketBindingService);
