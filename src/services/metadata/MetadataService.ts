import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {deepValue, traverseObject, isNotNullOrUndefined} from "../../common/utils/Utils";
import IInjectorService = angular.auto.IInjectorService;
import deepmerge = require("deepmerge");
import IHttpService = angular.IHttpService;

const module: ng.IModule = App.module("managementConsole.services.metadata", []);

export class MetadataService {

  static $inject: string[] = ["$q", "$http", "$injector", "dmrService"];

  constructor(private $q: ng.IQService,
              private $http: IHttpService,
              private $injector: IInjectorService,
              private dmrService: DmrService) {
  }

  public mergeMetadata(meta: any, json: string): ng.IPromise<any> {
    return this.getMetaAugmentation(json).then(rootOfAugmentedTree => {
      return this.traverseAndResolve(rootOfAugmentedTree).then(augmentedCompleted => {
        return this.mergeMetadataObjectTrees(meta, augmentedCompleted);
      });
    });
  }

  public getMetaAugmentation(json: string): ng.IPromise<any>{
    let deferred: ng.IDeferred<any> = this.$q.defer<any>();
    if (json.indexOf(".json") > -1) {
      this.$http.get(json).then(res => {
        let augmentedMeta: any = res.data;
        deferred.resolve(augmentedMeta);
      });
    } else {
      let augmentedMeta: any = JSON.parse(json);
      deferred.resolve(augmentedMeta);
    }
    return deferred.promise;
  }

  public traverseAndResolve(rootOfAugmentedTree: any): ng.IPromise<any>{
    let deferred: ng.IDeferred<any> = this.$q.defer<any>();
    let promises: ng.IPromise<any>[] = [];
    //traverse the meta augmentation tree
    traverseObject(rootOfAugmentedTree, (key: string, value: any, trail: string []) => {
      //If we find resolve attribute on a certain meta object node we
      //invoke the specified method on the specified service
      if (key === "resolve") {
        let invocationMeta: any = value;
        let serviceName: any = invocationMeta["service"];
        let methodName: any = invocationMeta["method"];
        let objectPath: string = invocationMeta["objectPath"];
        let service: any = this.$injector.get(serviceName);
        let parentObject = deepValue(rootOfAugmentedTree, trail);
        let promise: ng.IPromise<any> = service[methodName]().then(objArrayResponse => {
          let stringArray: string [] = [];
          for(let responseObject of objArrayResponse){
            if (isNotNullOrUndefined(objectPath)) {
              //peel into object and resolve object path
              stringArray.push(deepValue(responseObject, objectPath));
            } else {
              //otherwise assume we got a simple object and use it directly
              stringArray.push(responseObject);
            }
          }
          //assign response to attribute "allowed" of the parent meta node relative to resolve
          parentObject["allowed"] = stringArray;
        });
        promises.push(promise);
      }
    }, []);
    this.$q.all(promises).then(() => {
      deferred.resolve(rootOfAugmentedTree);
    });
    return deferred.promise;
  }

  public mergeMetadataObjectTrees(metadata: any, rootOfAugmentedTree: any): ng.IPromise<any> {
    let deferred: ng.IDeferred<any> = this.$q.defer<any>();
    deferred.resolve(deepmerge(metadata, rootOfAugmentedTree));
    return deferred.promise;
  }
}

module.service("metadataService", MetadataService);
