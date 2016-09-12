import {IConfigurationCallback} from "../../common/configuration/IConfigurationCallback";
import {isNotNullOrUndefined, isNullOrUndefined, deepGet, createPath, isObject} from "../../common/utils/Utils";
import {
  getMetaForResource, makeFieldClean, isFieldValueModified,
  fieldChangeRequiresRestart, makeFieldDirty
} from "../../common/configuration/ConfigUtil";

const CACHE_STORES: {[key: string]: {id: string, label: string, fields: string[]}} = {
  "None": {
    id: "None",
    label: "No Cache Store",
    fields: []
  },
  "binary-keyed-jdbc-store": {
    id: "binary-keyed-jdbc-store",
    label: "Binary Keyed JDBC Store",
    fields: ["datasource", "dialect"]
  },
  "store": {
    id: "store",
    label: "Custom Store",
    fields: ["class"]
  },
  "file-store": {
    id: "file-store",
    label: "File Store",
    fields: ["max-entries", "path", "relative-to"]
  },
  "leveldb-store": {
    id: "leveldb-store",
    label: "LevelDB Store",
    fields: ["path", "block-size", "cache-size", "clear-threshold"]
  },
  "mixed-keyed-jdbc-store": {
    id: "mixed-keyed-jdbc-store",
    label: "Mixed Keyed JDBC Store",
    fields: ["datasource", "dialect"]
  },
  "remote-store": {
    id: "remote-store",
    label: "Remote Store",
    fields: ["remote-servers", "cache", "hotrod-wrapping", "socket-timeout", "protocol-version", "raw-values", "tcp-no-delay"]
  },
  "rest-store": {
    id: "rest-store",
    label: "Rest Store",
    fields: ["remote-servers", "path", "append-cache-name-to-path"]
  },
  "string-keyed-jdbc-store": {
    id: "string-keyed-jdbc-store",
    label: "String Keyed JDBC Store",
    fields: ["datasource", "dialect"]
  }
};
const CUSTOM_FIELDS: string[] = ["is-new-node", "store-original-type"];

interface StoreScope extends ng.IScope {
  prevType: string;
}

export class CacheStoresCtrl implements IConfigurationCallback {

  cacheType: string;
  data: any;
  meta: any;
  readOnly: boolean;
  configCallbacks: IConfigurationCallback[];

  storeTypes: {[key: string]: {id: string, label: string, fields: string[]}};
  checkboxes: string[];
  fields: string[];
  store: any;
  previousStoreType: string;
  storeView: string;
  levelDb: any;
  prevData: any;

  constructor() {
    if (isNotNullOrUndefined(this.configCallbacks)) {
      this.configCallbacks.push(this);
    }

    this.data = isNullOrUndefined(this.data) ? {} : this.data;
    this.storeTypes = CACHE_STORES;
    this.checkboxes = this.getCommonCheckboxes();

    let storeType: string = this.getStoreType();
    this.data["store-type"] = storeType;
    this.fields = CACHE_STORES[storeType].fields;

    this.meta.currentStore = this.isNoStoreSelected() ? {} : angular.copy(getMetaForResource(this.meta, storeType));
    this.store = this.getStoreObject();
    this.store["is-new-node"] = this.isNoStoreSelected();
    this.storeView = this.getStoreView(storeType);
    this.previousStoreType = storeType;

    this.initWriteBehindData();
    this.initLevelDbChildrenAndMeta(storeType);
    this.cleanMetadata();
  }

  isAnyFieldModified(): boolean {
    let restartRequired: boolean = this.prevData["store-type"] !== this.data["store-type"];
    if (restartRequired) {
      return true;
    }

    if (isNotNullOrUndefined(this.meta.currentStore)) {
      return Object.keys(this.meta.currentStore).some(field => {
        let meta: any = this.getFieldMetaObject(field);
        return isFieldValueModified(meta);
      });
    }
    return false;
  }

  isRestartRequired(): boolean {
    let restartRequired: boolean = this.prevData["store-type"] !== this.data["store-type"];
    if (restartRequired) {
      return true;
    }

    if (isNotNullOrUndefined(this.meta.currentStore)) {
      return Object.keys(this.meta.currentStore).some(field => {
        let meta: any = this.getFieldMetaObject(field);
        return isFieldValueModified(meta) && fieldChangeRequiresRestart(meta);
      });
    }
    return false;
  }

  cleanMetadata(): void {
    this.prevData = {};
    angular.forEach(this.meta.currentStore, (value, key) => {
      if (isObject(value)) {
        makeFieldClean(value);
        this.prevData[key] = angular.copy(this.store[key]);
      }
    });

    this.prevData["store-type"] = this.data["store-type"];
    this.meta["store-type"] = {
      uiModified: false,
      style: null,
      description: "The type of cache store."
    };
    this.data["store-original-type"] = this.prevData["store-type"];
  }

  hasStringKeyedTable(): boolean {
    return isNotNullOrUndefined(this.data) && isNullOrUndefined(this.data["string-keyed-table"]);
  }

  hasBinaryKeyedTable(): boolean {
    return isNotNullOrUndefined(this.data) && isNullOrUndefined(this.data["binary-keyed-table"]);
  }

  // Save callback as variable to ensure that this binds to the class scope
  undoStoreTypeChange: Function = () => {
    let currentStoreType: string = this.data["store-type"];
    let originalStoreType: string = this.prevData["store-type"];
    let nonNullStore: boolean = originalStoreType !== "None";

    if (nonNullStore) {
      let originalStoreKey: string = this.getStoreObjectKey(originalStoreType);
      this.data[originalStoreType] = {};
      this.data[originalStoreType][originalStoreKey] = this.store;
      this.storeView = this.getStoreView(originalStoreType);
    }
    this.data["store-type"] = originalStoreType;

    this.updateStoreAttributesAndMeta(originalStoreType, currentStoreType);
    makeFieldClean(this.getFieldMetaObject("store-type"));
  };

  // Save callback as variable to ensure that this binds to the class scope
  updateStoreType: Function = () => {
    let storeType: string = this.data["store-type"];
    let previousStore: any = this.store;
    let previousType: string = this.previousStoreType;
    let storeTypeChanged: boolean = this.prevData["store-type"] !== storeType;

    if (storeTypeChanged) {
      makeFieldDirty(this.meta["store-type"]);
    } else {
      makeFieldClean(this.meta["store-type"]);
    }

    this.storeView = this.getStoreView(storeType);
    if (this.isNoStoreSelected()) {
      this.meta.currentStore = {};
      return;
    }

    let storeKey: string = this.getStoreObjectKey(storeType);
    this.updateStoreAttributesAndMeta(storeType, previousType);
    this.data[storeType] = {};
    this.data[storeType][storeKey] = isNotNullOrUndefined(previousStore) ? previousStore : {};
    this.store = this.data[storeType][storeKey];
    this.store["is-new-node"] = storeTypeChanged;
    this.previousStoreType = storeType;
  };

  undoLdbImplementationChange: Function = () => {
    this.undoLevelDbSelectChange("implementation", "implementation");
  };

  undoLdbCompressionChange: Function = () => {
    this.undoLevelDbSelectChange("type", "compression");
  };

  getFieldMetaValues(field: string, parent?: string): any {
    let meta: any = this.getFieldMetaObject(field, parent)["value-type"];
    return isNotNullOrUndefined(meta) ? meta : {};
  }

  private updateStoreAttributesAndMeta(newStoreType: string, oldStoreType: string): void {
    let noPrevStore: boolean = isNotNullOrUndefined(oldStoreType) && oldStoreType === "None";
    let oldMeta: any = this.meta.currentStore;
    let newMeta: any = angular.copy(getMetaForResource(this.meta, newStoreType));

    if (!noPrevStore) {
      if (isNotNullOrUndefined(newMeta)) {
        angular.forEach(this.store, (value, key) => {
          if (CUSTOM_FIELDS.indexOf(key) < 0) {
            if (key !== "write-behind" && !newMeta.hasOwnProperty(key)) {
              delete this.store[key];
            } else if (isNotNullOrUndefined(oldMeta)) {
              newMeta[key] = oldMeta[key];
            }
          }
        });
      }
      this.data[oldStoreType] = null;
    }
    this.fields = CACHE_STORES[newStoreType].fields;
    this.meta.currentStore = newMeta;
    this.initWriteBehindData(newStoreType !== oldStoreType);
    this.initLevelDbChildrenAndMeta(newStoreType);
  }

  private isNoStoreSelected(): boolean {
    return this.data["store-type"] === "None";
  }

  private getStoreObject(): any {
    let storeKey: string = this.data["store-type"];
    if (this.isNoStoreSelected()) {
      return {};
    }

    let objectKey: string = this.getStoreObjectKey(storeKey);
    if (isNullOrUndefined(this.data[storeKey][objectKey])) {
      this.data[storeKey][objectKey] = {};
    }
    return this.data[storeKey][objectKey];
  }

  private getStoreType(): string {
    for (let key in CACHE_STORES) {
      let store: any = this.data[key];
      if (isNotNullOrUndefined(store)) {
        let storeObject: any = store[this.getStoreObjectKey(key)];
        if (Object.keys(storeObject).length > 1) {
          return key;
        }
      }
    }
    return "None";
  }

  private getStoreObjectKey(storeKey: string): string {
    return storeKey.toUpperCase().replace(/-/g, "_");
  }

  private getStoreView(storeType: string): string {
    let viewDir: string = "components/cache-stores/view/";
    switch (storeType) {
      case "None":
        return null;
      case "string-keyed-jdbc-store":
      case "binary-keyed-jdbc-store":
      case "mixed-keyed-jdbc-store":
        return viewDir + "jdbc-store.html";
      default:
        return viewDir + storeType + ".html";
    }
  }

  private getCommonCheckboxes(): string[] {
    let checkboxes: string[] = [];
    let genericStoreMeta: any = getMetaForResource(this.meta, "store");
    angular.forEach(genericStoreMeta, (value, key) => {
      let type: any = value.type;
      let deprecated: boolean = isNotNullOrUndefined(value.deprecated);
      if (isNotNullOrUndefined(type)) {
        let modelType: string = type.TYPE_MODEL_VALUE;
        if (isNotNullOrUndefined(modelType) && modelType === "BOOLEAN" && !deprecated) {
          checkboxes.push(key);
        }
      }
    });
    return checkboxes;
  }

  private initWriteBehindData(typeHasChanged: boolean = false): void {
    if (this.isNoStoreSelected()) {
      return; // Do nothing as this wb data and meta is not required
    }

    let storeMeta: any = this.meta.currentStore;
    if (isNullOrUndefined(storeMeta["write-behind"])) {
      let meta: any = angular.copy(getMetaForResource(this.meta, "write-behind"));
      this.addModelChildToMetaAndStore("write-behind", meta, this.store, storeMeta);
    }

    if (typeHasChanged) {
      this.store["write-behind"].WRITE_BEHIND["is-new-node"] = true;
    }
  }

  private initLevelDbChildrenAndMeta(storeType: string): void {
    if (this.isNoStoreSelected() || storeType !== "leveldb-store") {
      return;
    }
    let meta: any = angular.copy(getMetaForResource(this.meta, "leveldb-children"));
    delete meta["write-behind"]; // Remove so we don"t overwrite existing field on merge
    delete meta.property;

    for (let key in meta) {
      this.addModelChildToMetaAndStore(key, meta, this.store, this.meta.currentStore);
    }

    // Init levelDb select ng-models. Can"t use store object directly as it does not allow existing values to
    // be the initially selected option.
    this.levelDb = {};
    this.levelDb.impl = deepGet(this.store, "implementation.IMPLEMENTATION");
    this.levelDb.comp = deepGet(this.store, "compression.COMPRESSION");
  }

  private addModelChildToMetaAndStore(key: string, childMeta: any, store: any, storeMeta: any): void {
    let objectKey: string = this.getStoreObjectKey(key);
    let path: string = createPath(".", [key, "model-description", objectKey]);
    let innerMeta: any = deepGet(childMeta, path);

    innerMeta.attributes.description = innerMeta.description;
    if (isNullOrUndefined(innerMeta.attributes.type)) {
      // We need this for undoFieldChange type check write-behind and other children stored as objects
      innerMeta.attributes.type = {TYPE_MODEL_VALUE: "OBJECT"};
    }

    storeMeta[key] = innerMeta.attributes;

    // If no existing values for field, create empty objects
    if (isNullOrUndefined(store[key]) || isNullOrUndefined(store[key][objectKey])) {
      store[key] = {};
      store[key][objectKey] = {"is-new-node": true};
    }

    // Set default values for values shown as list
    for (let attributeKey in innerMeta.attributes) {
      let attribute: any = innerMeta.attributes[attributeKey];
      if (isNotNullOrUndefined(attribute) && isNotNullOrUndefined(attribute.allowed) &&
        isNullOrUndefined(store[key][objectKey][attributeKey])) {
        store[key][objectKey][attributeKey] = attribute.default;
      }
    }
  }

  private getFieldMetaObject(field: string, parent?: string): any {
    let meta: any = this.meta.currentStore;
    if (isNotNullOrUndefined(parent)) {
      return meta[parent][field];
    }
    return this.meta.hasOwnProperty(field) ? this.meta[field] : this.meta.currentStore[field];
  }

  private undoLevelDbSelectChange(field: string, parent: string): void {
    let path: string = createPath(".", [parent, this.getStoreObjectKey(parent)]);
    let storeObject: any = deepGet(this.store, path);
    let prevObject: any = deepGet(this.prevData, path);

    if (isNullOrUndefined(prevObject)) {
      // If no prevVal exists, then restore to the default value
      let meta: any = this.getFieldMetaObject(field, parent);
      storeObject[field] = angular.copy(meta.default);
    } else {
      storeObject[field] = angular.copy(prevObject[field]);
    }
  };
}
