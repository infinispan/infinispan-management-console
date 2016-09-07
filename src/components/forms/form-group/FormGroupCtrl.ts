import {
  isNullOrUndefined, isBoolean, isNotNullOrUndefined,
  convertCacheAttributeIntoFieldName
} from "common/utils/Utils";
import {
  makeFieldClean,
  makeFieldDirty,
  getTypeModelType
} from "common/configuration/ConfigUtil";

export class FormGroupCtrl {

  data: any;
  field: string;
  label: string;
  meta: any;
  previousValue: any;
  placeholder: string;
  readOnly: boolean;
  optionString: string;
  optionValues: any;
  changeCallback: Function;
  undoCallback: Function;

  private type: string;
  private multiValue: boolean;
  private option: string;

  constructor() {
    if (isNullOrUndefined(this.optionString)) {
      this.type = getTypeModelType(this.meta);
      this.multiValue = this.meta.hasOwnProperty("allowed") ? this.meta.allowed : false;
      this.option = "item as item for item in meta.allowed";
    } else {
      this.multiValue = true;
      this.option = this.optionString.concat(" in ctrl.optionValues");
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
  }

  getStyle(): string {
    return this.meta.hasOwnProperty("style")  ? this.meta.style : "";
  }

  resolveFieldName(): string {
    if (isNotNullOrUndefined(this.label)) {
      return this.label;
    }
    return convertCacheAttributeIntoFieldName(this.field);
  }

  createOrUpdateProperty(field: string, key: string, value: any): void {
    this.data[field] = this.data[field] || {};
    this.data[field][key] = value;
    this.fieldValueModified();
  }

  removeProperty(field: string, key: string): void {
    delete this.data[field][key];
    this.fieldValueModified();
  }
}
