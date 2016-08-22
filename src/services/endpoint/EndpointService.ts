import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IEndpoint} from "./IEndpoint";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {SocketBindingService} from "../socket-binding/SocketBindingService";
import {ISocketBinding} from "../socket-binding/ISocketBinding";
import IQService = angular.IQService;

const module: ng.IModule = App.module("managementConsole.services.endpoint", []);

export class EndpointService {
  static $inject: string[] = ["$q", "dmrService", "socketBindingService"];

  static parseEndpoint(name: string, object: any, socketBinding?: ISocketBinding): IEndpoint {
    return <IEndpoint> {
      name: name,
      "cache-container": object["cache-container"],
      encryption: (object.encryption != null && object.encryption !== undefined) ? object.encryption : "",
      "socket-binding-name": object["socket-binding"],
      "socket-binding": socketBinding
    };
  }

  constructor(private $q: IQService, private dmrService: DmrService,
              private socketBindingService: SocketBindingService) {
  }

  getAllEndpoints(profileName: string, socketBindingGroup: string): ng.IPromise<IEndpoint[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: [].concat("profile", profileName, "subsystem", "datagrid-infinispan-endpoint"),
      recursive: true
    };
    let deferred: ng.IDeferred<IEndpoint[]> = this.$q.defer<IEndpoint[]>();

    this.dmrService.readResource(request)
    .then((endpointResponse: any): IEndpoint[] => {
      let endpoints: IEndpoint[] = [];
      for (let name in endpointResponse) {
        let endpointObject: any = endpointResponse[name][name];
        endpoints.push(EndpointService.parseEndpoint(name, endpointObject));
      }
      return endpoints;
    })
    .then((endpoints) => {
      return this.socketBindingService.getAllSocketBindingsInGroup(socketBindingGroup).then((socketBindings) => {
        this.addSocketBindingToEndpoint(socketBindings, endpoints);
        deferred.resolve(endpoints);
      });
    });
    return deferred.promise;
  }

  private addSocketBindingToEndpoint(socketBindings: ISocketBinding[], endpoints: IEndpoint[]): void {
    for (let endpoint of endpoints) {
      for (let socketBinding of socketBindings) {
        if (endpoint["socket-binding-name"] === socketBinding.name) {
          endpoint["socket-binding"] = socketBinding;
          break;
        }
      }
    }
  }
}

module.service("endpointService", EndpointService);
