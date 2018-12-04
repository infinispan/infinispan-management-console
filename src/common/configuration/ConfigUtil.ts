import {isNotNullOrUndefined, deepGet, isNullOrUndefined, isObject} from "../utils/Utils";
import {ISPNException} from "../utils/ISPNException";

export const PERSISTENCE_PATH: string = "children.persistence.model-description.PERSISTENCE.";
export const RESOURCE_DESCRIPTION_MAP: Object = {
  "general": ".attributes",
  "locking": "children.locking.model-description.LOCKING.attributes",
  "eviction": "children.eviction.model-description.EVICTION.attributes",
  "expiration": "children.expiration.model-description.EXPIRATION.attributes",
  "indexing": "children.indexing.model-description.INDEXING.attributes",
  "compatibility": "children.compatibility.model-description.*.attributes",
  "partition-handling": "children.partition-handling.model-description.PARTITION_HANDLING.attributes",
  "tx": "children.transaction.model-description.TRANSACTION.attributes",
  "statetransfer": "children.state-transfer.model-description.STATE_TRANSFER.attributes",
  "backup": "children.backup.model-description.*.attributes",
  "authorization": "children.security.model-description.*.children.authorization.model-description.*.attributes",
  "filestore": PERSISTENCE_PATH + "children.file-store.model-description.*.attributes",
  "remotestore": PERSISTENCE_PATH + "children.remote-store.model-description.*.attributes",
  "string-keyed-jdbc-store": PERSISTENCE_PATH + "children.string-keyed-jdbc-store.model-description.*.attributes",
  "remote-store": PERSISTENCE_PATH + "children.remote-store.model-description.*.attributes",
  "file-store": PERSISTENCE_PATH + "children.file-store.model-description.*.attributes",
  "rocksdb-store": PERSISTENCE_PATH + "children.rocksdb-store.model-description.*.attributes",
  "store": PERSISTENCE_PATH + "children.store.model-description.*.attributes",
  "rest-store": PERSISTENCE_PATH + "children.rest-store.model-description.*.attributes",
  "loader": PERSISTENCE_PATH + "children.loader.model-description.*.attributes",
  "write-behind": PERSISTENCE_PATH + "children.store.model-description.*.children",
  "rocksdb-children": PERSISTENCE_PATH + "children.rocksdb-store.model-description.*.children",
};

export function isFieldValueModified(meta: any): boolean {
  return isNotNullOrUndefined(meta) && meta.uiModified === true;
}

export function fieldChangeRequiresRestart(meta: any): boolean {
  return isNotNullOrUndefined(meta) && meta["restart-required"] !== "no-services";
}

export function convertListToJson(data: any, meta: any, field: string): void {
  if (isNotNullOrUndefined(meta[field]) && meta[field].type.TYPE_MODEL_VALUE === "LIST") {
    data[field] = JSON.stringify(data[field]);
  }
}

export function makeFieldDirty(field: any): void {
  if (isNotNullOrUndefined(field)) {
    field.uiModified = true;
    field.style = {"background-color": "#fbeabc"};
  }
}

export function makeFieldClean(field: any): void {
  if (isNotNullOrUndefined(field)) {
    field.uiModified = false;
    field.style = null;
  }
}

export function makeAllFieldsClean(meta: any): void {
  if (isNotNullOrUndefined(meta.uiModified)) {
    makeFieldClean(meta);
  }

  if (meta.hasOwnProperty("value-type")) {
    angular.forEach(meta["value-type"], value => makeAllFieldsClean(value));
  }
}

export function resolveDescription(metadata: Object, elementPath: string, cacheType: string): any {
  var path: string = "children.configurations.model-description.CONFIGURATIONS.children." + cacheType + "-configuration.model-description.*";
  var realPath: string = RESOURCE_DESCRIPTION_MAP[elementPath];
  var resourceDescription: any = deepGet(metadata, path);
  return deepGet(resourceDescription, realPath);
}

export function resolveFieldType(metadata: Object, field: string): string {
  if (isNotNullOrUndefined(metadata) && isNotNullOrUndefined(field)) {
    var resolvedField: any = metadata[field];
    return getTypeModelType(resolvedField);
  } else {
    throw new ISPNException("Invalid metadata " + metadata + " or field " + field);
  }
}

export function getTypeModelType(field: any): string {
  if (isNotNullOrUndefined(field) && isNotNullOrUndefined(field.type)) {
    var fieldType: string;
    switch (field.type.TYPE_MODEL_VALUE) {
      case "DOUBLE":
      case "LONG":
      case "INT":
      case "STRING":
      case "LIST":
        fieldType = "text";
        break;
      case "BOOLEAN":
        fieldType = "checkbox";
        break;
      case "OBJECT":
        fieldType = "table";
        break;
      default:
        fieldType = undefined;
    }
    return fieldType;
  }
}

export function getMetaForResource(meta: any, resource: string): any {
  let resourcePath: string = RESOURCE_DESCRIPTION_MAP[resource];
  return deepGet(meta, resourcePath);
}

// Create an object that has the combined properties/objects of the
export function deepMergeTemplates(parent: any, child: any): any {
  let newObject: any = {};
  Object.keys(parent).forEach(key => newObject[key] = parent[key]);
  Object.keys(child).forEach(key => {
    let parentVal: any = parent[key];
    let childVal: any = child[key];
    if (isNullOrUndefined(childVal)) {
      // if (isNotNullOrUndefined(parentVal) )

      return;
    }

    if (!isObject(childVal) || isNullOrUndefined(parentVal)) {
      newObject[key] = childVal;
    } else {
      newObject[key] = deepMergeTemplates(parentVal, childVal);
    }
  });
  return newObject;
}
