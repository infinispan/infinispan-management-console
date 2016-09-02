import {ISPNException} from "./ISPNException";
import {IServerAddress} from "../../services/server/IServerAddress";
import {ServerAddress} from "../../services/server/ServerAddress";

export const resourceDescriptionMap: Object = {
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

export function isString(object: any): boolean {
  return (typeof object === "string");
}

export function stringEndsWith(str: string, suffix: string): boolean {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

export function isNonEmptyString(str: string): boolean {
  return isString(str) && str.length > 0;
}

export function isBoolean(object: any): boolean {
  return (typeof object === "boolean");

}

export function isNumber(object: any): boolean {
  return (typeof object === "number");
}

export function isObject(object: any): boolean {
  return isNotNullOrUndefined(object) && !isBoolean(object) && !isString(object) && !isNumber(object);
}

export function isNotNullOrUndefined(value: any): boolean {
  return !(isNullOrUndefined(value));
}

export function isNullOrUndefined(value: any): boolean {
  return value === undefined || value === null;

}

export function isNonEmptyArray(array: any[]): boolean {
  return isNotNullOrUndefined(array) && array.length > 0;
}

export function getArraySize(array: string[]): number {
  if (isNonEmptyArray(array)) {
    return array.length;
  }
  return 0;
}

export function isArray(value: any): boolean {
  return Object.prototype.toString.call(value) === "[object Array]";
}

export function isEmptyObject(object: Object): boolean {
  for (var name in object) { // tslint:disable-line
    return false;
  }
  return true;
}

export function deepSet(object: Object, path: String, value: any): void {
  var a: string[] = path.split(".");
  var o: Object = object;
  for (var i: number = 0; i < a.length - 1; i++) {
    var n: string = a[i];
    if (n in o) {
      o = o[n];
    } else {
      o[n] = {};
      o = o[n];
    }
  }
  o[a[a.length - 1]] = value;
}

export function deepGet(object: Object, path: string): any {
  var o: Object = object;
  path = path.replace(/\[(\w+)\]/g, ".$1");
  path = path.replace(/^\./, "");
  var a: string[] = path.split(".");
  while (a.length) {
    var n: string = a.shift();
    if (n in o) {
      o = o[n];
    } else {
      return;
    }
  }
  return o;
}

export function deepValue(object: Object, path: string): any {
  for (var i: number = 0, pathArray: string[] = path.split("."), len: number = pathArray.length; i < len; i++) {
    if (isNotNullOrUndefined(object)) {
      object = object[pathArray[i]];
    } else {
      return null;
    }
  }
  return object;
}

export function resolveDescription(metadata: Object, elementPath: string, cacheType: string): any {
  var path: string = "children.configurations.model-description.CONFIGURATIONS.children." + cacheType + "-configuration.model-description.*";
  var realPath: string = resourceDescriptionMap[elementPath];
  var resourceDescription: any = deepGet(metadata, path);
  return deepGet(resourceDescription, realPath);
}

export function convertCacheAttributeIntoFieldName(attribute: string): string {
  var str: string = attribute.replace(/-/g, " ");
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
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

// TODO update when cacheModel object has been defined
export function getCacheMode(cacheModel: any): string {
  return cacheModel.configuration.mode === "SYNC" ? "Sync" : "Async";
}

export function traverse(obj: any, callback: Function, trail?: any[]): void {
  trail = trail || [];
  Object.keys(obj).forEach((key) => {
    var value: any = obj[key];

    if (Object.getPrototypeOf(value) === Object.prototype) {
      traverse(value, callback, trail.concat(key));
    } else {
      callback.call(obj, key, value, trail);
    }
  });
}

export function parseServerAddress(server: string): IServerAddress {
  let address: string[] = server.split(":");
  if (address.length !== 2) {
    throw new ISPNException("Expected server string to be of format '<host>:<string>', not: " + server);
  }
  return new ServerAddress(address[0], address[1]);
}

// TODO implement other methods as required
