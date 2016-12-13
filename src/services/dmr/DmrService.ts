import {App} from "../../ManagementConsole";
import {IDmrRequest} from "./IDmrRequest";
import {IDmrCompositeReq} from "./IDmrCompositeReq";
import {isNotNullOrUndefined, isNullOrUndefined} from "../../common/utils/Utils";

const module: ng.IModule = App.module("managementConsole.services.dmr", []);

export class DmrService {

  static $inject: string[] = ["$http", "$cacheFactory", "$q", "$location"];

  url: string;
  urlUpload: string;

  constructor(private $http: ng.IHttpService,
              private $cacheFactory: ng.ICacheFactoryService,
              private $q: ng.IQService,
              private $location: ng.ILocationService) {
  }

  add(request: IDmrRequest): angular.IPromise<any> {
    request.operation = "add";
    return this.executePost(request);
  }

  readResource(request: IDmrRequest): angular.IPromise<any> {
    request.operation = "read-resource";
    return this.executePost(request);
  }

  readResourceDescription(request: IDmrRequest): ng.IPromise<any> {
    request.operation = "read-resource-description";
    return this.executePost(request);
  }

  readAttribute(request: IDmrRequest): angular.IPromise<any> {
    request.operation = "read-attribute";
    return this.executePost(request);
  }

  readAttributeAndResolveExpression(request: IDmrRequest): angular.IPromise<any> {
    request.operation = "read-attribute";
    request["resolve-expressions"] = true;
    return this.executePost(request);
  }

  writeAttribute(request: IDmrRequest): angular.IPromise<any> {
    request.operation = "write-attribute";
    return this.executePost(request);
  }

  readChildResources(request: IDmrRequest): angular.IPromise<any> {
    request.operation = "read-children-resources";
    return this.executePost(request);
  }

  readChildName(request: IDmrRequest): ng.IPromise<any> {
    request.operation = "read-children-names";
    return this.executePost(request);
  }

  readEventLog(request: IDmrRequest): ng.IPromise<any> {
    request.operation = "read-event-log";
    return this.executePost(request);
  }

  executePost(request: IDmrRequest | IDmrCompositeReq, noTimeout?: boolean): ng.IPromise<any> {
    return this.executePostHelper(JSON.stringify(request), false, noTimeout);
  }

  executeFileUpload(request: IDmrRequest | IDmrCompositeReq, file: File, noTimeout?: boolean): ng.IPromise<any> {

    let fd: FormData = new FormData();

    // First we append the file if we have it
    if (isNotNullOrUndefined(file)) {
      fd.append("file", file);
    }

    // Second, we append the DMR request
    let blob: Blob = new Blob([JSON.stringify(request)], {type: "application/json"});
    fd.append("operation", blob);

    return this.executePostHelper(fd, true, noTimeout);
  }

  clearGetCache(): void {
    this.$cacheFactory.get("$http").removeAll();
  }

  private executePostHelper(data: any, upload: boolean, noTimeout?: boolean): ng.IPromise<any> {
    if (upload) {
      return this.executePostUpload(data, noTimeout);
    } else {
      return this.executeRegularPost(data, noTimeout);
    }
  }

  private executePostUpload(data: any, upload: boolean, noTimeout?: boolean): ng.IPromise<any> {
    // see https://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
    let config: ng.IRequestShortcutConfig = {
      transformRequest: angular.identity,
      headers: {
        "Content-Type": undefined,
        "X-Management-Client-Name": "HAL",
      }
    };

    if (!noTimeout) {
      config.timeout = 2000;
    }
    let deferred: ng.IDeferred<any> = this.$q.defer<any>();
    this.urlUpload = isNullOrUndefined(this.urlUpload) ? this.generateBaseUrl(true) : this.urlUpload;
    this.$http.post(this.urlUpload, data, config)
      .then(
        (success: any) => deferred.resolve(success.data.result),
        (failure: any) => {
          this.processDmrFailure(deferred, failure);
          this.urlUpload = null;
        });
    return deferred.promise;
  }

  private executeRegularPost(data: any, noTimeout?: boolean): ng.IPromise<any> {
    let config: ng.IRequestShortcutConfig = {
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "X-Management-Client-Name": "HAL"
      }
    };

    if (!noTimeout) {
      config.timeout = 2000;
    }

    let deferred: ng.IDeferred<any> = this.$q.defer<any>();
    this.url = isNullOrUndefined(this.url) ? this.generateBaseUrl() : this.url;
    this.$http.post(this.url, data, config)
      .then(
        (success: any) => deferred.resolve(success.data.result),
        (failure: any) => {
          this.processDmrFailure(deferred, failure);
          this.url = null;
        });
    return deferred.promise;
  }

  private generateBaseUrl(upload?: boolean): string {
    let l: ng.ILocationService = this.$location;
    let base: string = `${l.protocol()}://${l.host()}:${l.port()}/`;
    if (upload) {
      return base + "management-upload";
    } else {
      return base + "management";
    }
  }

  private processDmrFailure(promise: ng.IDeferred<any>, response: any): void {
    let msg: string = "An unspecified error has been received from the server";
    if (response.status !== 401) {
      let result: any = response.data;
      if (result && result["failure-description"] != null) {
        if (isNotNullOrUndefined(result["failure-description"]["domain-failure-description"])) {
          msg = result["failure-description"]["domain-failure-description"];
        } else {
          msg = result["failure-description"];
        }
      }
      console.log(msg);
      promise.reject(msg);
    }
  }
}

module.service("dmrService", DmrService);
