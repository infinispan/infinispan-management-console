import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IEndpoint} from "./IEndpoint";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {SocketBindingService} from "../socket-binding/SocketBindingService";
import {ISocketBinding} from "../socket-binding/ISocketBinding";
import IQService = angular.IQService;
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {isNotNullOrUndefined, traverse, deepValue} from "../../common/utils/Utils";
import {ICacheContainer} from "../container/ICacheContainer";

const module: ng.IModule = App.module("managementConsole.services.endpoint", []);

export class EndpointService {
  static $inject: string[] = ["$q", "dmrService", "socketBindingService", "launchType"];

  static parseEndpoint(name: string, object: any, socketBinding?: ISocketBinding): IEndpoint {
    return <IEndpoint> {
      name: name,
      "cache-container": object["cache-container"],
      encryption: (object.encryption != null && object.encryption !== undefined) ? object.encryption : "",
      "socket-binding-name": object["socket-binding"],
      "socket-binding": socketBinding,
      "hotrod-socket-binding": object["hotrod-socket-binding"],
      "rest-socket-binding": object["rest-socket-binding"]
    };
  }

  constructor(private $q: IQService, private dmrService: DmrService,
              private socketBindingService: SocketBindingService, private launchType: LaunchTypeService) {
  }

  getAllEndpoints(cacheContainer: ICacheContainer): ng.IPromise<IEndpoint[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: this.getEndpointAddress(cacheContainer.profile),
      recursive: true
    };
    let deferred: ng.IDeferred<IEndpoint[]> = this.$q.defer<IEndpoint[]>();

    this.dmrService.readResource(request)
      .then((endpointResponse: any): IEndpoint[] => {
        let endpoints: IEndpoint[] = [];
        let trail: String [] = [];
        traverse(endpointResponse, (key: string, value: string, trail: string []) => {
          let traversedObject: any = deepValue(endpointResponse, trail);
          let isEndpoint: boolean = isNotNullOrUndefined(traversedObject) && key === "cache-container";
          let isMultiRouterEndpoint: boolean = (isNotNullOrUndefined(traversedObject) && key === "hotrod-socket-binding");
          if (isEndpoint) {
            let endpoint: IEndpoint = EndpointService.parseEndpoint(traversedObject.name, traversedObject);
            if (endpoint["cache-container"] === cacheContainer.name) {
              endpoints.push(endpoint);
            }
          } else if (isMultiRouterEndpoint) {
            //TODO anything special needed here?
            let endpoint: IEndpoint = EndpointService.parseEndpoint(traversedObject.name, traversedObject);
            endpoints.push(endpoint);
          }
        }, trail);
        return endpoints;
      })
      .then((endpoints) => {
        return this.socketBindingService.getAllSocketBindingsInGroup(cacheContainer.serverGroup["socket-binding-group"]).then((socketBindings) => {
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
        } if (endpoint["hotrod-socket-binding"] === socketBinding.name) {
          endpoint["hotrod-socket-binding"] = socketBinding;
        } if (endpoint["rest-socket-binding"] === socketBinding.name) {
          endpoint["rest-socket-binding"] = socketBinding;
        }
      }
    }
  }

  private getEndpointAddress(profile: string): string[] {
    let endpointPath: string[] = ["subsystem", "datagrid-infinispan-endpoint"];
    return this.launchType.getProfilePath(profile).concat(endpointPath);
  }
}

module.service("endpointService", EndpointService);
