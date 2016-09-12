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
  configCallbacks: IConfigurationCallback[];
  placeholders: any;

  constructor() {
    if (isNullOrUndefined(this.data)) {
      this.data = {};
    }
    if (isNotNullOrUndefined(this.configCallbacks)) {
      this.configCallbacks.push(this);
    }
    this.prevData = {};
    this.data["is-new-node"] = !this.hasAnyFieldPreviousData();
    this.cleanMetadata();
    this.createPlaceholders();
  }

  hasAnyFieldPreviousData(): boolean {
    return this.fields.some(group => {
      return group.fields.some(attr => isNotNullOrUndefined(this.data[attr]), this);
    });
  }

  isAnyFieldModified(): boolean {
    return this.fields.some(group => {
      return group.fields.some(attrName => {
        return isFieldValueModified(this.meta[attrName]);
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
