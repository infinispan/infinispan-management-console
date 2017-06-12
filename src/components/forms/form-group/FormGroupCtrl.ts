import {
  isNullOrUndefined,
  isBoolean,
  isNotNullOrUndefined,
  convertCacheAttributeIntoFieldName
} from "../../../common/utils/Utils";
import {makeFieldClean, makeFieldDirty, getTypeModelType} from "../../../common/configuration/ConfigUtil";
import {generateFieldId} from "../../directives/IdGeneratorDirective";

export class FormGroupCtrl {

  data: any;
  field: string;
  label: string;
  parent: string;
  meta: any;
  previousValue: any;
  placeholder: string;
  readOnly: boolean;
  optionString: string;
  optionValues: any;
  changeCallback: Function;
  undoCallback: Function;

  type: string;
  multiValue: boolean;
  multiSelect: boolean;
  multiSettings: any;
  option: string;
  parentId: Function = generateFieldId;

  constructor() {
    this.multiSettings = {
      template: "{{option}}",
      smartButtonTextConverter(skip: any, option: any): any {
        return option;
      }
    };
    this.type = getTypeModelType(this.meta);
    if (this.meta.type.TYPE_MODEL_VALUE === "LIST" && isNotNullOrUndefined(this.data[this.field])) {
      this.data[this.field] = JSON.parse(this.data[this.field]);
    }
    if (isNullOrUndefined(this.optionString)) {
      this.type = getTypeModelType(this.meta);
      this.multiValue = isNotNullOrUndefined(this.meta) && this.meta.hasOwnProperty("allowed") ? this.meta.allowed : false;
      this.multiSelect = isNotNullOrUndefined(this.meta) && this.meta.hasOwnProperty("allowed") && this.meta["select-option"] === "multiple" ? true : false;
      if (this.multiSelect) {
        this.option = this.meta.allowed;
        if (isNullOrUndefined(this.data[this.field])) {
          this.data[this.field] = [];
        }
      } else {
        this.option = "item as item for item in $ctrl.meta.allowed";
      }
    } else {
      this.multiSelect = isNotNullOrUndefined(this.meta) && this.meta.hasOwnProperty("allowed") && this.meta["select-option"] === "multiple" ? true : false;
      this.multiValue = true;
      if (this.multiSelect) {
        this.option = this.meta.allowed;
        if (isNullOrUndefined(this.data[this.field])) {
          this.data[this.field] = [];
        }
      } else {
        this.option = this.optionString.concat(" in $ctrl.optionValues");
      }
    }
  }

  fieldValueModified(): void {
    let original: any = this.previousValue;
    let latest: any = this.data[this.field];

    /* tslint:disable:triple-equals Necessary as values can be numbers, so == is valid */
    if (latest === original || latest == original || (isBoolean(latest) && !latest && isNullOrUndefined(original)) ||
      (!latest && isNullOrUndefined(original))) {
      makeFieldClean(this.meta);
    } else {
      makeFieldDirty(this.meta);
    }

    if (isNotNullOrUndefined(this.changeCallback)) {
      this.changeCallback(this.field, original, latest);
    }
  }

  getStyle(): string {
    if (isNotNullOrUndefined(this.meta)) {
      return this.meta.hasOwnProperty("style") ? this.meta.style : "";
    }
  }

  resolveFieldName(): string {
    if (isNotNullOrUndefined(this.label)) {
      return this.label;
    }
    return convertCacheAttributeIntoFieldName(this.field);
  }

  createOrUpdateProperty(key: string, value: any): void {
    this.data[this.field] = this.data[this.field] || {};
    this.data[this.field][key] = value;
    this.fieldValueModified();
  }

  removeProperty(key: string): void {
    delete this.data[this.field][key];
    this.fieldValueModified();
  }
}
