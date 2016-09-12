import {isNotNullOrUndefined, deepGet} from "../utils/Utils";
import {ISPNException} from "../utils/ISPNException";

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
  "filestore": "children.file-store.model-description.*.attributes",
  "remotestore": "children.remote-store.model-description.*.attributes",
  "mixed-keyed-jdbc-store": "children.mixed-keyed-jdbc-store.model-description.*.attributes",
  "binary-keyed-jdbc-store": "children.binary-keyed-jdbc-store.model-description.*.attributes",
  "string-keyed-jdbc-store": "children.string-keyed-jdbc-store.model-description.*.attributes",
  "remote-store": "children.remote-store.model-description.*.attributes",
  "file-store": "children.file-store.model-description.*.attributes",
  "leveldb-store": "children.leveldb-store.model-description.*.attributes",
  "store": "children.store.model-description.*.attributes",
  "rest-store": "children.rest-store.model-description.*.attributes",
  "backup": "children.backup.model-description.*.attributes",
  "loader": "children.loader.model-description.*.attributes",
  "authorization": "children.security.model-description.*.children.authorization.model-description.*.attributes",
  "write-behind": "children.store.model-description.*.children",
  "leveldb-children": "children.leveldb-store.model-description.*.children",
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
  field.uiModified = true;
  field.style = {"background-color": "#fbeabc"};
}

export function makeFieldClean(field: any): void {
  field.uiModified = false;
  field.style = null;
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
  if (isNotNullOrUndefined(field)) {
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
  } else {
    throw new ISPNException("Unresolved field for" + field);
  }
}

export function getMetaForResource(meta: any, resource: string): any {
  let resourcePath: string = RESOURCE_DESCRIPTION_MAP[resource];
  return deepGet(meta, resourcePath);
}
