import {isNotNullOrUndefined, isNullOrUndefined} from "../../common/utils/Utils";
import {IConfigurationCallback} from "../../common/configuration/IConfigurationCallback";
import {
  isFieldValueModified,
  fieldChangeRequiresRestart,
  convertListToJson,
  makeFieldClean
} from "../../common/configuration/ConfigUtil";

export class ConfigurationSectionCtrl implements IConfigurationCallback {

  data: any;
  meta: any;
  prevData: any;
  fields: {name: string, fields: string[]}[];
  initDefaults: boolean;
  readOnly: boolean;
  readOnlyFields: string[];
  render: boolean;
  configCallbacks: IConfigurationCallback[];
  removable: boolean;
  placeholders: any;
  loadedWithData: boolean;
  createdOrDestroyedFromUI: boolean = false;

  constructor() {
    if (isNullOrUndefined(this.data)) {
      this.data = {};
    }
    if (isNotNullOrUndefined(this.configCallbacks)) {
      this.configCallbacks.push(this);
    }
    this.prevData = {};
    let hasFieldsWithData: boolean = this.hasAnyFieldPreviousData();
    this.loadedWithData = hasFieldsWithData;
    this.data["is-new-node"] = !hasFieldsWithData;
    this.cleanMetadata();
    this.createPlaceholders();
  }

  hasAnyFieldPreviousData(): boolean {
    return this.fields.some(group => {
      return group.fields.some(attr => isNotNullOrUndefined(this.data[attr]), this);
    });
  }

  isAnyFieldModified(): boolean {
    return this.createdOrDestroyedFromUI || this.fields.some(group => {
      return group.fields.some(attrName => {
        return isNotNullOrUndefined(this.meta) && isFieldValueModified(this.meta[attrName]);
      }, this);
    });
  }

  isRestartRequired(): boolean {
    return this.fields.some(group => {
      return group.fields.some(attrName => {
        return isFieldValueModified(this.meta[attrName]) && fieldChangeRequiresRestart(this.meta[attrName]);
      }, this);
    });
  }

  cleanMetadata(): void {
    this.fields.forEach(group => {
      group.fields.forEach(attrName => {
        convertListToJson(this.data, this.meta, attrName);
        this.cleanFieldMeta(attrName);
        this.prevData[attrName] = isNotNullOrUndefined(this.data[attrName]) ? angular.copy(this.data[attrName]) : "";
      }, this);
    });
  }

  isReadOnly(field: string): boolean {
    if (isNotNullOrUndefined(this.readOnlyFields)) {
      return this.readOnlyFields.some(readOnlyField => readOnlyField === field);
    }
    return false;
  }

  createNewDefault(): void {
    // initialize all fields with default values, make fields dirty
    this.iterateFields((att: string) => {
      this.data[att] = this.meta[att].default;
      this.prevData[att] = this.meta[att].default;
    });
    this.data["is-new-node"] = !this.loadedWithData;
    this.data["is-removed"] = false;
    this.createdOrDestroyedFromUI = true;
  }

  destroy(): void {
    this.data = {};
    this.prevData = {};
    this.data["is-new-node"] = !this.loadedWithData;
    this.data["is-removed"] = this.loadedWithData;
    this.cleanMetadata();
    this.createdOrDestroyedFromUI = true;
  }

  iterateFields(callback: (attribute: string) => void): void {
    this.fields.forEach((group) => {
      group.fields.forEach((attrName) => {
        if (this.meta[attrName].hasOwnProperty("default")) {
          callback(attrName);
        }
      });
    });
  }

  isRemovable: Function = () => isNotNullOrUndefined(this.removable) ? this.removable : false;

  private createPlaceholders(): void {
    if (!this.initDefaults) {
      return;
    }
    this.placeholders = {};
    this.fields.forEach((group) => {
      group.fields.forEach((attrName) => {
        if (this.meta[attrName].hasOwnProperty("default")) {
          this.placeholders[attrName] = this.meta[attrName].default;
        }
      });
    });
  }

  private cleanFieldMeta(field: string): void {
    if (isNotNullOrUndefined(this.meta[field])) {
      makeFieldClean(this.meta[field]);
    }
  }
}
