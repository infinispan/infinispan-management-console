import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import {isNotNullOrUndefined, isObject, convertCacheAttributeIntoFieldName} from "../../common/utils/Utils";
import {makeFieldClean} from "../../common/configuration/ConfigUtil";

export class CacheStoreModalCtrl {

  static $inject: string[] = ["$uibModalInstance", "data", "meta", "fields", "prevData", "title"];

  constructor(private $uibModalInstance: IModalServiceInstance,
              public data: any,
              public meta: any,
              public fields: {name: string}[],
              public prevData: any,
              public title: string) {
  }

  cancelModal(): void {
    this.undoAllFieldChanges(this.data);
    this.$uibModalInstance.dismiss();
  }

  submitModal(): void {
    this.data.modified = this.isObjectModified(this.data, this.meta);
    this.$uibModalInstance.close(this.data);
  }

  getMetadataObject(field: string, parent?: string): any {
    if (isNotNullOrUndefined(parent)) {
      return this.meta[parent]["value-type"][field];
    } else {
      return this.meta[field];
    }
  }

  undoFieldChange(field: string, parent?: string): void {
    let meta: any = this.getMetadataObject(field, parent);
    makeFieldClean(meta);

    if (isNotNullOrUndefined(parent)) {
      this.data[parent][field] = angular.copy(this.prevData[parent][field]);
    } else {
      this.data[field] = angular.copy(this.prevData[field]);
    }
  }

  undoAllFieldChanges(object: any, parent?: string): void {
    for (let key in object) {
      if (key === "is-new-node") {
        continue;
      }
      let val: any = object[key];
      if (isObject(val)) {
        this.undoAllFieldChanges(val, key);
      } else {
        this.undoFieldChange(key, parent);
      }
    }
  }

  isParentDefined(field: any): boolean {
    return isNotNullOrUndefined(field.parent);
  }

  resolveFieldName(field: string, parent?: string): any {
    let fieldName: string = convertCacheAttributeIntoFieldName(field);
    if (isNotNullOrUndefined(parent)) {
      fieldName = convertCacheAttributeIntoFieldName(parent) + " " + fieldName;
    }
    return fieldName;
  }

  private isObjectModified(data: any, meta: any): boolean {
    for (let key in data) {
      if (data.hasOwnProperty(key) && isNotNullOrUndefined(meta[key])) {
        let value: any = data[key];
        let modified: boolean = false;
        if (isObject(value)) {
          let subMeta: any = meta[key]["value-type"];
          modified = this.isObjectModified(value, subMeta);
        } else {
          modified = meta[key].uiModified;
        }
        if (modified) {
          return true;
        }
      }
    }
    return false;
  }
}
