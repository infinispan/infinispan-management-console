import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IEndpoint} from "./IEndpoint";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {SocketBindingService} from "../socket-binding/SocketBindingService";
import {ISocketBinding} from "../socket-binding/ISocketBinding";
import IQService = angular.IQService;
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {
  isNotNullOrUndefined, traverse, deepValue, isNullOrUndefined, isObject,
  isJsonString, traverseObject
} from "../../common/utils/Utils";
import {ICacheContainer} from "../container/ICacheContainer";
import {IServerGroup} from "../server-group/IServerGroup";
import {IServerAddress} from "../server/IServerAddress";
import {CompositeOpBuilder, createWriteAttrReq} from "../dmr/CompositeOpBuilder";
import IPromise = angular.IPromise;
import {Endpoint} from "./Endpoint";
import {IDmrCompositeReq} from "../dmr/IDmrCompositeReq";

const module: ng.IModule = App.module("managementConsole.services.endpoint", []);

export class EndpointService {
  static $inject: string[] = ["$q", "dmrService", "socketBindingService", "launchType"];

  static parseEndpoint(namePath: string [], object: any, socketBinding?: ISocketBinding): IEndpoint {
    return new Endpoint(namePath, object, socketBinding);
  }

  constructor(private $q: IQService, private dmrService: DmrService,
              private socketBindingService: SocketBindingService, private launchType: LaunchTypeService) {
  }

  getAllEndpoints(cacheContainer: ICacheContainer): ng.IPromise<IEndpoint[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: this.getEndpointsRootAddress(cacheContainer.profile),
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
            let endpoint: IEndpoint = EndpointService.parseEndpoint(trail, traversedObject);
            if (endpoint.getCacheContainer() === cacheContainer.name) {
              endpoints.push(endpoint);
            }
          } else if (isMultiRouterEndpoint) {
            let endpoint: IEndpoint = EndpointService.parseEndpoint(trail, traversedObject);
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

  getEndpoint(serverGroup: IServerGroup, endpointType: string, name: string): ng.IPromise<IEndpoint> {
    let resolvedName: string = isNotNullOrUndefined(name) ? name : endpointType;
    let request: IDmrRequest = <IDmrRequest>{
      address: this.getEndpointsRootAddress(serverGroup.profile).concat(endpointType).concat(resolvedName),
      recursive: true,
    };
    return this.dmrService.readResource(request).then((endpointResponse: any): IEndpoint => {
      return EndpointService.parseEndpoint([].concat(endpointType).concat(name), endpointResponse);
    });
  }

  getAllClusterEndpoints(serverGroup: IServerGroup): ng.IPromise<IEndpoint[]> {
    let request: IDmrRequest = <IDmrRequest>{
      address: this.getEndpointsRootAddress(serverGroup.profile),
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
            let endpoint: IEndpoint = EndpointService.parseEndpoint(trail, traversedObject);
            endpoints.push(endpoint);
          } else if (isMultiRouterEndpoint) {
            let endpoint: IEndpoint = EndpointService.parseEndpoint(trail, traversedObject);
            endpoints.push(endpoint);
          }
        }, trail);
        return endpoints;
      })
      .then((endpoints) => {
        return this.socketBindingService.getAllSocketBindingsInGroup(serverGroup["socket-binding-group"]).then((socketBindings) => {
          this.addSocketBindingToEndpoint(socketBindings, endpoints);
          deferred.resolve(endpoints);
        });
      });
    return deferred.promise;
  }

  getConfigurationMeta(profile: string, endpointType: string, endpointName: string): ng.IPromise<any> {
    let deferred: ng.IDeferred<any> = this.$q.defer();
    let address: string[] = this.getEndpointsRootAddress(profile).concat(endpointType).concat(endpointType);
    this.dmrService.readResourceDescription({
      address: address,
      recursive: true
    }).then(
      response => {
        //TODO perhaps inspect and adjust the response
        deferred.resolve(response);
      },
      error => deferred.reject(error));
    return deferred.promise;
  }

  save(endpoint: IEndpoint, excludedAttributes: string []): ng.IPromise<any> {
    let builder: CompositeOpBuilder = new CompositeOpBuilder();
    let root: any = endpoint.getDMR();
    let dmrAddress: string [] = this.getEndpointAddress(endpoint, "clustered");
    this.dmrService.traverseDMRTree(builder, root, dmrAddress, excludedAttributes);
    let req: IDmrCompositeReq  = builder.build();
    req.steps = req.steps.reverse();
    return this.dmrService.executePost(req);
  }

  private addSocketBindingToEndpoint(socketBindings: ISocketBinding[], endpoints: IEndpoint[]): void {
    for (let endpoint of endpoints) {
      for (let socketBinding of socketBindings) {
        if (endpoint.getSocketBindingName() === socketBinding.name) {
          endpoint.setSocketBinding(socketBinding);
        }
      }
    }
  }

  private getEndpointsRootAddress(profile: string): string[] {
    let endpointPath: string[] = ["subsystem", "datagrid-infinispan-endpoint"];
    return this.launchType.getProfilePath(profile).concat(endpointPath);
  }

  private getEndpointAddress(endpoint: IEndpoint, profile: string): string[] {
    let endpointPath: string[] = ["subsystem", "datagrid-infinispan-endpoint"];
    return this.launchType.getProfilePath(profile).concat(endpointPath).concat(endpoint.getType()).concat(endpoint.getName());
  }
}

module.service("endpointService", EndpointService);
