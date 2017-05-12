import {App} from "../../ManagementConsole";
import {IDmrRequest} from "./IDmrRequest";
import {IDmrCompositeReq} from "./IDmrCompositeReq";
import {
  isNotNullOrUndefined, isNullOrUndefined, traverseObject, isObject,
  isJsonString
} from "../../common/utils/Utils";
import {CompositeOpBuilder, createWriteAttrReq} from "./CompositeOpBuilder";

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

  traverseDMRTree(builder: CompositeOpBuilder, dmrRoot: any, dmrAddress: string [], excludedAttributes: string []): void {
    // traverse the object tree
    traverseObject(dmrRoot, (key: string, value: any, trail: string []) => {
      this.visitTraversedObject(builder, value, trail.concat(key), excludedAttributes);
    }, dmrAddress);

    // and finally visit root object itself...
    this.visitTraversedObject(builder, dmrRoot, dmrAddress, excludedAttributes);
  }

  private visitTraversedObject(builder: CompositeOpBuilder, obj: any,
                               address: string[], excludedAttributes: string []): void {
    this.addCompositeOperationsToBuilder(builder, address, obj, excludedAttributes);
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
      promise.reject(msg);
    }
  }

  private addCompositeOperationsToBuilder(builder: CompositeOpBuilder, address: string[], config: any,
                                          excludedAttributes: string[], force: boolean = false): void {
    let createAddOp: boolean = force || config["is-new-node"];
    let remove: boolean = config["is-removed"];
    if (createAddOp) {
      let request: IDmrRequest = this.createAddOperation(address, config, excludedAttributes);
      if (Object.keys(request).length > 2 || config["required-node"]) {
        // request.length > 2 means that the operation has the address and operation type, so add to builder
        // Or if 'required-node' is present, then we know that this node must be created, even if empty.
        // This is required for when child nodes may also have been defined without the parent.
        builder.add(this.createAddOperation(address, config, excludedAttributes));
      }
    } else if (remove) {
      builder.add(this.createRemoveOperation(address));
    } else {
      this.createWriteAttributeOperations(builder, address, config, excludedAttributes);
      this.composeWriteObjectOperations(builder, address, config);
    }
  }

  private createAddOperation(address: string[], config: any, excludedAttributes: string[]): IDmrRequest {
    let allowedObjects: string[] = ["indexing-properties", "string-keyed-table", "binary-keyed-table"];
    let op: IDmrRequest = {
      address: address,
      operation: "add"
    };

    if (isNotNullOrUndefined(config)) {
      // iterate properties of model object and append (key/value) properties to op object
      angular.forEach(config, (value, key) => {
        if (isNullOrUndefined(value)) {
          return;
        }

        if (isObject(value)) {
          // Only process allowed objects, these should be objects which are dmr attributes not children
          if (allowedObjects.indexOf(key) > -1) {
            op[key] = value;
          }
          return;
        }

        if (isJsonString(value)) { // handle JSON described objects
          value = this.parseJson(value, key);
        }
        op[key] = value;
      });
    }
    // Remove excluded attributes
    angular.forEach(excludedAttributes, attribute => delete op[attribute]);
    return op;
  }

  private createRemoveOperation(address: string[]): IDmrRequest {
    return <IDmrRequest> {
      address: address,
      operation: "remove"
    };
  }

  private createWriteAttributeOperations(builder: CompositeOpBuilder, address: string[], config: any,
                                         excludedAttributes: string[]): void {
    if (isNotNullOrUndefined(config)) {
      angular.forEach(config, (value, key) => {
        let excluded: boolean = excludedAttributes.some(attribute => key === attribute) || isNullOrUndefined(value) || isObject(value);
        if (!excluded) {
          if (isJsonString(value)) {
            value = this.parseJson(value, key);
          }
          builder.add(createWriteAttrReq(address, key, value));
        }
      });
    }
  }

  private composeWriteObjectOperations(builder: CompositeOpBuilder, address: string[], config: any): void {
    if (isNotNullOrUndefined(config)) {
      let includedAttributes: string[] = ["indexing-properties", "string-keyed-table", "binary-keyed-table"];
      angular.forEach(config, (value, key) => {
        let included: boolean = includedAttributes.some(attribute => key === attribute);
        if (included && isObject(value)) {
          builder.add(createWriteAttrReq(address, key, value));
        }
      });
    }
  }

  private parseJson(value: string, key: string): string {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.log("Invalid JSON value " + value + " for field " + key);
    }
  }
}

module.service("dmrService", DmrService);
