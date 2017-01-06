import {IConfigurationCallback} from "../../common/configuration/IConfigurationCallback";
import {isNotNullOrUndefined, deepGet} from "../../common/utils/Utils";
import {
  isFieldValueModified,
  fieldChangeRequiresRestart,
  makeFieldClean,
  makeFieldDirty
} from "../../common/configuration/ConfigUtil";

export const MEMORY_TYPES: string [] = [ "NONE", "BINARY", "OBJECT", "OFF-HEAP"];

export class MemoryCtrl implements IConfigurationCallback {

  data: any;
  meta: any;
  memoryTypeData: any;
  memoryTypeMeta: any;
  readOnly: boolean;
  configCallbacks: IConfigurationCallback[];
  memoryTypes: string [];
  fields: string[] = [];
  allfields: string [] = [];
  prevData: any;
  type: string = "";

  constructor() {
    this.fields.length = 0;
    this.memoryTypes = MEMORY_TYPES;
    if (isNotNullOrUndefined(this.configCallbacks)) {
      this.configCallbacks.push(this);
    }
    if (isNotNullOrUndefined(this.data)) {
      for (let field of this.filterFields(this.data)) {
        this.setMemoryType(field);
        this.data.initialType = field;
      }
      this.data["is-new-node"] = false;
    }
    else {
      this.data = {};
      this.setMemoryType("NONE");
      this.data["is-new-node"] = true;
    }
    this.prevData = {};
    this.cleanMetadata();
  }

  setMemoryType(newType: string): void {
    if (isNotNullOrUndefined(newType)) {
      this.fields.length = 0;
      this.type = newType;
      this.memoryTypeData = isNotNullOrUndefined(this.data[newType]) ? this.data[newType] : {};
      this.memoryTypeMeta = (newType !== "NONE") ? angular.copy(deepGet(this.meta, "children.memory.model-description." + newType + ".attributes")) : {};
      for (var field in this.memoryTypeMeta) {
        this.fields.push(field);
      }
      this.data[newType] = this.memoryTypeData;
      this.memoryTypeData.type = newType;
      this.memoryTypeMeta.type = {description: "Memory management type"};

      this.allfields = angular.copy(this.fields);
      this.allfields.push("type");
    }
  }

  filterFields(data: any): string [] {
    let fields: string [] = [];
    for (let field in data) {
      if (MEMORY_TYPES.indexOf(field) > -1) {
        fields.push(field)
      }
    }
    return fields;
  }

  changeMemoryType: Function = () => {
    if (this.type !== this.memoryTypeData.type) {
      delete this.data[this.type];
      this.setMemoryType(this.memoryTypeData.type);
      makeFieldDirty(this.memoryTypeMeta.type);
    }
  };

  undoMemoryTypeChange: Function = () => {
    this.undoFieldChange("type");
    this.setMemoryType(this.prevData.type);
  };

  isMemoryDefined(): boolean {
    return isNotNullOrUndefined(this.data);
  }

  isAnyFieldModified(): boolean {
    return this.allfields.some(attrName => isFieldValueModified(this.memoryTypeMeta[attrName]));
  }

  isRestartRequired(): boolean {
    return this.allfields.some(attrName => isFieldValueModified(this.memoryTypeMeta[attrName])
    && fieldChangeRequiresRestart(this.memoryTypeMeta[attrName]));
  }

  cleanMetadata(): void {
    this.allfields.forEach(attrName => {
      makeFieldClean(this.memoryTypeMeta[attrName]);
      this.prevData[attrName] = angular.copy(this.memoryTypeData[attrName]);
    });
  }

  getStyle(field: string): string {
    return isNotNullOrUndefined(this.memoryTypeMeta[field]) ? this.memoryTypeMeta[field].style : "";
  }

  private undoFieldChange(field: string): void {
    this.memoryTypeData[field] = this.prevData[field];
    makeFieldClean(this.memoryTypeMeta[field]);
  }
}
