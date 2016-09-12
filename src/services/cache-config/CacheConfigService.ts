import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {ICacheConfiguration} from "./ICacheConfiguration";
import {ITemplate} from "../container-config/ITemplate";
import {ICacheContainer} from "../container/ICacheContainer";
import {
  isNotNullOrUndefined, deepGet, isNullOrUndefined, isObject, isString,
  isJsonString, deepValue
} from "../../common/utils/Utils";
import {CompositeOpBuilder, createWriteAttrReq, createRemoveReq} from "../dmr/CompositeOpBuilder";

const module: ng.IModule = App.module("managementConsole.services.cache-config", []);

export const CACHE_TYPES: string[] = ["distributed-cache", "replicated-cache", "local-cache", "invalidation-cache"];

export class CacheConfigService {
  static $inject: string[] = ["$q", "dmrService", "launchType"];

  constructor(private $q: ng.IQService,
              private dmrService: DmrService,
              private launchType: LaunchTypeService) {
  }

  createTemplate(container: ICacheContainer, templateType: string, templateName: string, config: any): ng.IPromise<void> {
    let address: string[] = this.getConfigAddress(container.name, container.profile)
      .concat(templateType + "-configuration", templateName);
    return this.createConfiguration(address, config, true);
  }

  updateTemplate(container: ICacheContainer, templateType: string, templateName: string, config: any): ng.IPromise<void> {
    let address: string[] = this.getConfigAddress(container.name, container.profile)
      .concat(templateType + "-configuration", templateName);

    return this.updateConfiguration(address, config);
  }

  getTemplate(container: ICacheContainer, templateType: string, templateName: string): ng.IPromise<any> {
    let deferred: ng.IDeferred<any> = this.$q.defer();
    this.dmrService.readResource({
      address: this.getConfigAddress(container.name, container.profile).concat(templateType + "-configuration", templateName),
      recursive: true
    }).then(response => {
      response.type = templateType;
      response["template-name"] = templateName;
      deferred.resolve(response);
    }, error => deferred.reject(error));

    return deferred.promise;
  }

  getTemplateMeta(container: ICacheContainer, templateType: string): ng.IPromise<any> {
    templateType = templateType + "-configuration";
    let deferred: ng.IDeferred<any> = this.$q.defer();
    let address: string[] = this.getConfigAddress(container.name, container.profile)
      .concat(templateType, this.getChildKey(templateType));

    this.dmrService.readResourceDescription({
      address: address,
      recursive: true
    }).then(
      response => {
        this.addMissingAttributesToMeta(response.attributes);
        this.modifyAuthorizationDmr(response);
        deferred.resolve(response);
      },
      error => deferred.reject(error));
    return deferred.promise;
  }

  getAllContainerTemplates(container: ICacheContainer): ng.IPromise<ITemplate[]> {
    let deferred: ng.IDeferred<ITemplate[]> = this.$q.defer<ITemplate[]>();
    let request: IDmrRequest = <IDmrRequest>{
      address: this.getConfigAddress(container.name, container.profile),
      "recursive-depth": 1
    };

    this.dmrService.readResource(request).then(
      response => deferred.resolve(this.extractTemplatesFromConfigurations(response)),
      error => deferred.reject(error));
    return deferred.promise;
  }

  removeContainerTemplate(container: ICacheContainer, template: ITemplate): ng.IPromise<void> {
    let address: string[] = this.getConfigAddress(container.name, container.profile).concat(template.type, template.name);
    return this.dmrService.executePost({
      address: address,
      operation: "remove"
    });
  }

  getCacheConfiguration(name: string, type: string, container: string, profile?: string): ng.IPromise<ICacheConfiguration> {
    let request: IDmrRequest = {
      address: this.getConfigAddress(container, profile).concat(type + "-configuration", name),
      recursive: true
    };
    return this.dmrService.readResource(request);
  }

  private getContainerAddress(container: string, profile?: string): string[] {
    let address: string[] = this.launchType.isStandaloneMode() ? [] : [].concat("profile", profile);
    return address.concat("subsystem", "datagrid-infinispan", "cache-container", container);
  }

  private getConfigAddress(container: string, profile?: string): string[] {
    return this.getContainerAddress(container, profile).concat("configurations", "CONFIGURATIONS");
  }

  private getChildKey(child: string): string {
    return child.toUpperCase().replace(/-/g, "_");
  }

  private addMissingAttributesToMeta(meta: any): void {
    meta.name = {
      description: "Cache name",
      type: {
        TYPE_MODEL_VALUE: "STRING"
      }
    };

    meta.type = {
      description: "The cache configuration type",
      allowed: CACHE_TYPES,
      type: {
        TYPE_MODEL_VALUE: "STRING"
      }
    };

    meta["template-name"] = {
      description: "The cache configuration template",
      type: {
        TYPE_MODEL_VALUE: "STRING"
      }
    };
  }

  private modifyAuthorizationDmr(meta: any): void {
    let authorization: any = deepGet(meta, "children.security.model-description.*.children.authorization.model-description.*.attributes");
    authorization.enabled = {
      description: "Enables authorization checks for a cache.",
      default: false,
      type: {
        TYPE_MODEL_VALUE: "BOOLEAN"
      }
    };

    authorization.roles = {
      description: "The list of roles which are allowed access the cache. If changing the list of roles, please " +
      "specify the list of roles as JSON list e.g. [\"admin\", \"writer\"].",
      type: {
        TYPE_MODEL_VALUE: "LIST"
      }
    };
  }

  private extractTemplatesFromConfigurations(config: any): ITemplate[] {
    let templateArray: ITemplate[] = [];
    angular.forEach(config, (templates, templateType) => {
      angular.forEach(templates, (template, templateName) => {
        templateArray.push({
          name: templateName,
          mode: template.mode,
          type: templateType.replace("-configuration", ""),
          traits: this.extractTraitsFromTemplate(template)
        });
      });
    });
    return templateArray;
  }

  private extractTraitsFromTemplate(template: any): string[] {
    let traits: string[] = [];
    if (isNotNullOrUndefined(template.backup)) {
      traits.push("Remotely Backedup");
    }
    if (isNotNullOrUndefined(template.compatibility)) {
      traits.push("Compatible");
    }
    if (isNotNullOrUndefined(template.indexing)) {
      traits.push("Indexed");
    }
    if (isNotNullOrUndefined(template.eviction)) {
      traits.push("Bounded");
    }
    let transactionMode: any = deepGet(template, "transaction.TRANSACTION.mode");
    if (isNotNullOrUndefined(transactionMode) && transactionMode !== "NONE") {
      traits.push("Transactional");
    }
    let securityEnabled: boolean = deepGet(template, "security.SECURITY.authorization.AUTHORIZATION.enabled");
    if (isNotNullOrUndefined(securityEnabled) && securityEnabled) {
      traits.push("Secured");
    }
    return traits;
  }

  private createConfiguration(address: string[], config: any, template: boolean): ng.IPromise<void> {
    config.template = template;
    let builder: CompositeOpBuilder = new CompositeOpBuilder();
    let deferred: ng.IDeferred<void> = this.$q.defer<void>();

    let createNodeRequest: IDmrRequest = this.createAddOperation(address, config, ["name", "type", "template-name"]);
    this.dmrService.executePost(createNodeRequest)
      .then(() => {
        this.createHelper(builder, address.concat("locking", "LOCKING"), config.locking);
        this.createHelper(builder, address.concat("eviction", "EVICTION"), config.eviction);
        this.createHelper(builder, address.concat("expiration", "EXPIRATION"), config.expiration);
        this.createHelper(builder, address.concat("indexing", "INDEXING"), config.indexing);
        this.createHelper(builder, address.concat("compatibility", "COMPATIBILITY"), config.compatibility);
        this.createHelper(builder, address.concat("partition-handling", "PARTITION_HANDLING"), config["partition-handling"]);
        this.createHelper(builder, address.concat("transaction", "TRANSACTION"), config.transaction);
        this.createHelper(builder, address.concat("state-transfer", "STATE_TRANSFER"), config["state-transfer"]);
        this.createHelper(builder, address.concat("backup", "BACKUP"), config.backup);

        this.createHelper(builder, address.concat("security", "SECURITY"), config.security);
        if (isNotNullOrUndefined(config.security)) {
          this.createHelper(builder, address.concat("security", "SECURITY", "authorization", "AUTHORIZATION"), config.security.SECURITY.authorization);
        }

        this.createCacheLoader(builder, address, config);
        this.createCacheStore(builder, address, config);

        return this.dmrService.executePost(builder.build());
      }, error => deferred.reject(error))
      .then(() => deferred.resolve(), error => deferred.reject(error));

    return deferred.promise;
  }

  private createHelper(builder: CompositeOpBuilder, address: string[], config: any): void {
    if (isNotNullOrUndefined(config)) {
      let exclusionList: string[] = ["is-new-node", "store-type", "store-original-type"];
      if (isNullOrUndefined(config.EVICTION) && isNullOrUndefined(config.COMPRESSION)) {
        exclusionList.push("type");
      }
      this.addOperationsToBuilder(builder, address, config, exclusionList, true);
    }
  }

  private createCacheLoader(builder: CompositeOpBuilder, address: string[], config: any): void {
    let loaderClass: string = deepGet(config, "loader.LOADER.class");
    if (isNotNullOrUndefined(loaderClass) && loaderClass !== "None") {
      this.createHelper(builder, address.concat("loader", "LOADER"), config.loader);
    }
  }

  private createCacheStore(builder: CompositeOpBuilder, address: string[], config: any): void {
    let storeType: string = config["store-type"];
    if (isNullOrUndefined(storeType) || storeType === "None" || isNullOrUndefined(config[storeType])) {
      return;
    }

    let objectKey: string = storeType.toUpperCase().replace(/-/g, "_");
    config[storeType][objectKey]["required-node"] = true;
    this.createHelper(builder, address.concat(storeType, objectKey), config[storeType]);

    let store: any = config[storeType][objectKey];
    if (isNotNullOrUndefined(store)) {
      for (let key in store) {
        let nestedObject: any = store[key];
        if (isObject(nestedObject)) {
          let nestedKey: string = key.toUpperCase().replace(/-/g, "_");
          if (isNotNullOrUndefined(nestedObject[nestedKey])) {
            let nestedAddress: string[] = address.concat(storeType, objectKey, key, nestedKey);
            this.updateHelper(builder, nestedAddress, nestedObject);
          }
        }
      }
    }
  }

  private updateConfiguration(address: string[], config: any): ng.IPromise<void> {
    let builder: CompositeOpBuilder = new CompositeOpBuilder();
    let exludedAttributes: string[] = ["name", "type", "template-name", "is-new-node", "is-create-with-bare-template",
      "is-create-mode", "store-type", "store-original-type", "required-node"];

    // Update the configuration node
    this.addCompositeOperationsToBuilder(builder, address, config, exludedAttributes);
    this.composeWriteObjectOperations(builder, address, config);

    // Update child nodes
    this.updateHelper(builder, address.concat("locking", "LOCKING"), config.locking);
    this.updateHelper(builder, address.concat("eviction", "EVICTION"), config.eviction);
    this.updateHelper(builder, address.concat("expiration", "EXPIRATION"), config.expiration);
    this.updateHelper(builder, address.concat("indexing", "INDEXING"), config.indexing);
    this.updateHelper(builder, address.concat("compatibility", "COMPATIBILITY"), config.compatibility);
    this.updateHelper(builder, address.concat("partition-handling", "PARTITION_HANDLING"), config["partition-handling"]);
    this.updateHelper(builder, address.concat("transaction", "TRANSACTION"), config.transaction);
    this.updateHelper(builder, address.concat("state-transfer", "STATE_TRANSFER"), config["state-transfer"]);
    this.updateHelper(builder, address.concat("backup", "BACKUP"), config.backup);

    this.updateSecurityAuthorization(config);
    this.updateHelper(builder, address.concat("security", "SECURITY"), config.security);
    if (isNotNullOrUndefined(config.security)) {
      this.updateHelper(builder, address.concat("security", "SECURITY", "authorization", "AUTHORIZATION"), config.security.SECURITY.authorization);
    }

    this.updateCacheLoader(builder, address, config);
    this.updateCacheStore(builder, address, config);
    return this.dmrService.executePost(builder.build());
  }

  private updateHelper(builder: CompositeOpBuilder, address: string[], config: any): void {
    if (isNotNullOrUndefined(config)) {
      // ISPN-6587: Exclude type from the exclusion list for EVICTION objects, as EVICTION.type exists.
      // Same for LevelDB->Compression. TODO need a better way to make exceptions
      let exclusionList: string[] = ["is-new-node", "store-type", "store-original-type"];
      if (isNullOrUndefined(config.EVICTION) && isNullOrUndefined(config.COMPRESSION)) {
        exclusionList.push("type");
      }
      this.addOperationsToBuilder(builder, address, config, exclusionList, false);
    }
  }

  private updateSecurityAuthorization(config: any): void {
    let auth: any = deepValue(config.security, "SECURITY.authorization.AUTHORIZATION");
    if (isNotNullOrUndefined(auth) && auth["is-new-node"] && auth.enabled) {
      config.secuirty.SECURITY["is-new-node"] = true;
    }
  }

  private updateCacheLoader(builder: CompositeOpBuilder, address: string[], config: any): void {
    if (isNullOrUndefined(config.loader)) {
      return;
    }

    let loaderAddress: string[] = address.concat("loader", "LOADER");
    let loaderClass: string = deepGet(config, "loader.LOADER.class");
    if (isNullOrUndefined(loaderClass) || loaderClass === "None") {
      let previousLoaderExisted: boolean = !config.loader["is-new-node"];
      if (previousLoaderExisted) {
        // Delete loader node as loader.class field cannot be empty
        builder.add(createRemoveReq(loaderAddress));
      }
      return;
    }
    this.updateHelper(builder, loaderAddress, config.loader);
  }

  private updateCacheStore(builder: CompositeOpBuilder, address: string[], config: any): void {
    let newStoreType: string = config["store-type"];
    let originalStoreType: string = config["store-original-type"];
    let newStore: boolean = newStoreType !== originalStoreType;

    // Add step to create/update JDBC store
    if (isNotNullOrUndefined(newStoreType) && newStoreType !== "None") {
      // We update the store followed by all of its children
      let objectKey: string = newStoreType.toUpperCase().replace(/-/g, "_");
      if (newStore) {
        config[newStoreType][objectKey]["required-node"] = true;
      }
      this.updateHelper(builder, address.concat(newStoreType, objectKey), config[newStoreType]);

      // Update all children objects
      let store: any = config[newStoreType][objectKey];
      if (isNotNullOrUndefined(store)) {
        for (let key in store) {
          let nestedObject: any = store[key];
          if (isObject(nestedObject)) {
            let nestedKey: string = key.toUpperCase().replace(/-/g, "_");
            if (isNotNullOrUndefined(nestedObject[nestedKey])) {
              let nestedAddress: string[] = address.concat(newStoreType, objectKey, key, nestedKey);
              this.updateHelper(builder, nestedAddress, nestedObject);
            }
          }
        }
      }
    }

    if (isNotNullOrUndefined(originalStoreType) && originalStoreType !== "None" && newStore) {
      let oldStoreAddress: string[] = address.concat(originalStoreType, originalStoreType.toUpperCase().replace(/-/g, "_"));
      builder.add(createRemoveReq(oldStoreAddress));
    }
  }

  private addOperationsToBuilder(builder: CompositeOpBuilder, address: string[], config: any,
                                 excludedAttributes: string[], force: boolean): void {
    if (isNotNullOrUndefined(config)) {
      let modelNode: string = address.slice(-1).pop();
      if (isNotNullOrUndefined(modelNode)) {
        this.addCompositeOperationsToBuilder(builder, address, config[modelNode], excludedAttributes, force);
      }
    }
  };

  private addCompositeOperationsToBuilder(builder: CompositeOpBuilder, address: string[], config: any,
                                          excludedAttributes: string[], force: boolean = false): void {
    let createAddOp: boolean = force || config["is-new-node"];
    if (createAddOp) {
      let request: IDmrRequest = this.createAddOperation(address, config, excludedAttributes);
      if (Object.keys(request).length > 2 || config["required-node"]) {
        // request.length > 2 means that the operation has the address and operation type, so add to builder
        // Or if 'required-node' is present, then we know that this node must be created, even if empty.
        // This is required for when child nodes may also have been defined without the parent.
        builder.add(this.createAddOperation(address, config, excludedAttributes));
      }
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

        if (isString(value)) { // handle JSON described objects
          if ((value.indexOf("{") > -1 && value.indexOf("}") > -1) ||
            (value.indexOf("[") > -1 && value.indexOf("]") > -1)) {
            try {
              op[key] = JSON.parse(value);
            } catch (e) {
              console.log("Invalid JSON value " + value + " for field " + key);
            }
          } else {
            op[key] = value;
          }
        }
      });
    }
    // Remove excluded attributes
    angular.forEach(excludedAttributes, attribute => delete op[attribute]);
    return op;
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

module.service("cacheConfigService", CacheConfigService);
