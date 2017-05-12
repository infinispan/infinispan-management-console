import {IServerAddress} from "../../services/server/IServerAddress";
import {ServerAddress} from "../../services/server/ServerAddress";

export function isString(object: any): boolean {
  return isNotNullOrUndefined(object) && typeof object === "string";
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
  return object === Object(object) && !isArray(object);
}

export function isJsonString(object: any): boolean {
  return isString(object) && ((object.indexOf("{") > -1 && object.indexOf("}") > -1) ||
    (object.indexOf("[") > -1 && object.indexOf("]") > -1));
}

export function isNotNullOrUndefined(value: any): boolean {
  return !(isNullOrUndefined(value));
}

export function isNullOrUndefined(value: any): boolean {
  return value === undefined || value === null;

}

export function createObjectsFromPath(name: string, separator: string, container: any): any {
  let ns: string [] = name.split(separator || ".");
  let o: any = container || window;
  let i: number;
  let len: number;
  for (i = 0, len = ns.length; i < len; i++) {
    o = o[ns[i]] = o[ns[i]] || {};
  }
  return o;
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
  if (isNullOrUndefined(object) || isNullOrUndefined(path)) {
    return null;
  }

  var o: Object = object;
  path = path.replace(/\[(\w+)\]/g, ".$1");
  path = path.replace(/^\./, "");
  var a: string[] = path.split(".");
  while (a.length) {
    var n: string = a.shift();
    if (isNotNullOrUndefined(o) && isNotNullOrUndefined(o[n])) {
      o = o[n];
    } else {
      return;
    }
  }
  return o;
}

export function deepValue(object: Object, path: any): any {
  let pathArray: string [] = [];
  if (isArray(path)) {
    pathArray = path;
  } else if (isString(path)) {
    pathArray = path.split(".");
  }
  for (var i: number = 0, len: number = pathArray.length; i < len; i++) {
    if (isNotNullOrUndefined(object)) {
      object = object[pathArray[i]];
    } else {
      return null;
    }
  }
  return object;
}

export function convertCacheAttributeIntoFieldName(attribute: string): string {
  var str: string = attribute.replace(/-/g, " ");
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function traverse(obj: any = {}, callback: Function, trail?: any[]): void {
  trail = trail || [];
  Object.keys(obj).forEach((key) => {
    var value: any = obj[key];

    if (isNotNullOrUndefined(value) && Object.getPrototypeOf(value) === Object.prototype) {
      traverse(value, callback, trail.concat(key));
    } else {
      callback.call(obj, key, value, trail);
    }
  });
}

export function traverseObject(obj: any, callback: Function, trail?: any[]): void {
  trail = trail || [];
  Object.keys(obj).forEach((key) => {
    var value: any = obj[key];

    if (isNotNullOrUndefined(value) && Object.getPrototypeOf(value) === Object.prototype) {
      traverseObject(value, callback, trail.concat(key));
      callback.call(obj, key, value, trail);
    }
  });
}

export function parseServerAddress(server: string): IServerAddress {
  let address: string[] = server.split(":");
  if (address.length !== 2) {
    // throw new ISPNException("Expected server string to be of format '<host>:<string>', not: " + server);
    // standalone mode
    return new ServerAddress(server, server);
  } else {
    return new ServerAddress(address[0], address[1]);
  }
}

export function getInstanceFromDmr<T>(dmr: any): T {
  let retObject: any = {};
  for (let key of Object.keys(dmr)) {
    retObject[key] = dmr[key];
  }
  return retObject;
}

export function capitalizeFirstLetter(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function createPath(separator: string, args: string[]): string {
    if (isArray(args)) {
      let path: string = "";
      for (let i: number = 0; i < args.length; i++) {
        /* tslint:disable:triple-equals */
        path += i == 0 ? args[i] : separator + args[i];
      }
      return path;
    }
    return null;
}

export function removeEmptyFieldsFromObject(object: any, recursive: boolean = false): void {
  angular.forEach(object, (value, key) => {
    if (recursive && isObject(value)) {
      var nestedObject: any = removeEmptyFieldsFromObject(value, true);
      if (isEmptyObject(nestedObject)) {
        delete object[key];
      }
    } else if (value === "" || isNullOrUndefined(value)) {
      delete object[key];
    }
  });
  return object;
}

export function setIsNewNodeRecursively(obj: Object, val: boolean = true): void {
  if (isNotNullOrUndefined(obj) && isObject(obj)) {
    obj["is-new-node"] = val;
    Object.keys(obj).forEach(key => {
      let value: any = obj[key];
      if (isNullOrUndefined(value)) {
        return;
      }

      // Only consider child nodes. Necessary to prevent is-new-node being set for attributes of type object
      let objectKey: string = key.toUpperCase().replace(/-/g, "_");
      value = value[objectKey];
      if (isNotNullOrUndefined(value) && isObject(value)) {
        setIsNewNodeRecursively(value, val);
      }
    });
  }
}
