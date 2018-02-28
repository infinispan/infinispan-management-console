import {App} from "../../ManagementConsole";
import {IRestRequest} from "./IRestRequest";
import {ISocketBinding} from "../socket-binding/ISocketBinding";
import {SocketBindingService} from "../socket-binding/SocketBindingService";
import IHttpPromise = angular.IHttpPromise;

const module: ng.IModule = App.module("managementConsole.services.rest", []);

export class RestService {

  static $inject: string[] = ["$http", "$cacheFactory", "$q", "$location", "socketBindingService"];

  private restBinding: ISocketBinding;

  constructor(private $http: ng.IHttpService,
              private $cacheFactory: ng.ICacheFactoryService,
              private $q: ng.IQService,
              private $location: ng.ILocationService,
              private socketBindingService: SocketBindingService) {

    // TODO somehow discover installed rest binding better than this?
    socketBindingService.getDefaultSocketBindingGroup().then((result: ISocketBinding []) => {
      angular.forEach(result, (value) => {
        if (value.name === "rest") {
          this.restBinding = value;
        }
      });
    });
  }

  executeCacheGet(cacheTarget: string, key: string): ng.IPromise<any> {
    let request: IRestRequest = {
      jsonPayload: undefined,
      cache: cacheTarget,
      urlSuffix: "/".concat(key)
    };
    let url: string = this.generateUrl(request);
    return this.executeHelper("get", url, request.jsonPayload, this.getDefaultHeaders());
  }

  executeCacheDelete(cacheTarget: string): ng.IPromise<any> {
    let request: IRestRequest = {
      jsonPayload: undefined,
      cache: cacheTarget,
      urlSuffix: undefined
    };
    let url: string = this.generateUrl(request);
    return this.executeHelper("delete", url, request.jsonPayload, this.getDefaultHeaders());
  }

  executeCacheDeleteKey(cacheTarget: string, key: string): ng.IPromise<any> {
    let request: IRestRequest = {
      jsonPayload: undefined,
      cache: cacheTarget,
      urlSuffix: "/".concat(key)
    };
    let url: string = this.generateUrl(request);
    return this.executeHelper("delete", url, request.jsonPayload, this.getDefaultHeaders());
  }

  executeCachePut(cacheTarget: string, key: string, data: any): ng.IPromise<any> {
    let request: IRestRequest = {
      jsonPayload: data,
      cache: cacheTarget,
      urlSuffix: "/".concat(key)
    };
    let url: string = this.generateUrl(request);
    return this.executeHelper("put", url, request.jsonPayload, this.getDefaultHeaders());
  }

  executeCachePost(cacheTarget: string, key: string, data: any): ng.IPromise<any> {
    let request: IRestRequest = {
      jsonPayload: data,
      cache: cacheTarget,
      urlSuffix: "/".concat(key)
    };
    let url: string = this.generateUrl(request);
    return this.executeHelper("post", url, request.jsonPayload, this.getDefaultHeaders());
  }

  executeCacheQuery(cacheTarget: string, query: string): ng.IPromise<any> {
    let request: IRestRequest = {
      jsonPayload: {query: query},
      cache: cacheTarget,
      urlSuffix: "?action=search"
    };
    let url: string = this.generateUrl(request);
    return this.executeHelper("post", url, request.jsonPayload, this.getDefaultHeaders());
  }

  clearGetCache(): void {
    this.$cacheFactory.get("$http").removeAll();
  }

  private executeHelper(type: string, url: string, data: any, headers?: ng.IRequestShortcutConfig): ng.IPromise<any> {
    let deferred: ng.IDeferred<any> = this.$q.defer<any>();
    let response: IHttpPromise;
    switch (type) {
      case "post":
        response = this.$http.post(url, data, headers);
        break;
      case "put":
        response = this.$http.put(url, data, headers);
        break;
      case "get":
        response = this.$http.get(url, headers);
        break;
      case "delete":
        response = this.$http.delete(url, headers);
        break;
      default:
        deferred.reject("Unknown request type " + type);
    }
    response.then(
      (success: any) => {
        deferred.resolve(success);
      },
      (failure: any) => {
        this.processResponseFailure(deferred, failure);
      });
    return deferred.promise;
  }

  private generateUrl(request: IRestRequest): string {
    let l: ng.ILocationService = this.$location;
    let base: string = `${l.protocol()}://${l.host()}:${this.restBinding.port}/`;
    return base + "rest/" + request.cache + request.urlSuffix;
  }

  private processResponseFailure(promise: ng.IDeferred<any>, response: any): void {

    if (response.status !== 401) {
      let result: any = response.data;
      promise.reject(result);
    }
  }

  private getDefaultHeaders(): ng.IRequestShortcutConfig {
    return <ng.IRequestShortcutConfig> {
      headers: {
        "Accept": "*/*",
        "Content-type": "application/json"
      }
    };
  }
}

module.service("restService", RestService);
