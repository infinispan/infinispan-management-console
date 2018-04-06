import {App} from "../../ManagementConsole";
import {ISocketBinding} from "../socket-binding/ISocketBinding";
import {SocketBindingService} from "../socket-binding/SocketBindingService";
import IHttpPromise = angular.IHttpPromise;
import {isNotNullOrUndefined} from "../../common/utils/Utils";

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
    let url: string = this.generateRequestURL(cacheTarget, key);
    return this.executeHelper("get", url, undefined);
  }

  executeCacheDelete(cacheTarget: string): ng.IPromise<any> {
    let url: string = this.generateRequestURL(cacheTarget, undefined);
    return this.executeHelper("delete", url, undefined);
  }

  executeCacheDeleteKey(cacheTarget: string, key: string): ng.IPromise<any> {
    let url: string = this.generateRequestURL(cacheTarget, key);
    return this.executeHelper("delete", url, undefined);
  }

  executeCachePut(cacheTarget: string, key: string, data: any): ng.IPromise<any> {
    let url: string = this.generateRequestURL(cacheTarget, key);
    return this.executeHelper("put", url, data);
  }

  executeCachePost(cacheTarget: string, key: string, data: any): ng.IPromise<any> {
    let url: string = this.generateRequestURL(cacheTarget, key);
    return this.executeHelper("post", url, data);
  }

  executeCacheQuery(cacheTarget: string, query: string): ng.IPromise<any> {
    let url: string = this.generateRequestURL(cacheTarget, "?action=search");
    return this.executeHelper("post", url, {query: query});
  }

  clearGetCache(): void {
    this.$cacheFactory.get("$http").removeAll();
  }

  private executeHelper(type: string, url: string, data: any): ng.IPromise<any> {
    let headers: ng.IRequestShortcutConfig = {
      headers: {
        "Accept": "*/*",
        "Content-type": "application/json"
      }
    };
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
    response.then(success => deferred.resolve(success), failure => deferred.reject(failure));
    return deferred.promise;
  }

  private generateRequestURL(cacheTarget: string, urlSuffix: string): string {
    let l: ng.ILocationService = this.$location;
    let base: string = `${l.protocol()}://${l.host()}:${this.restBinding.port}/`;
    return base + "rest/" + cacheTarget + (isNotNullOrUndefined(urlSuffix) ? "/".concat(urlSuffix) : "");
  }
}

module.service("restService", RestService);
