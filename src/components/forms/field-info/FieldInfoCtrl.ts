import {
  isFieldValueModified,
  fieldChangeRequiresRestart,
  makeFieldClean,
  makeAllFieldsClean
} from "../../../common/configuration/ConfigUtil";
import {deepGet, isNotNullOrUndefined} from "../../../common/utils/Utils";
import {generateFieldId} from "../../directives/IdGeneratorDirective";

export class FieldInfoCtrl {
  data: any;
  meta: any;
  parent: string;
  field: string;
  previousValue: any;
  readOnly: boolean;
  undoCallback: Function;
  parentId: Function = generateFieldId;

  isFieldValueModified(): boolean {
    return isFieldValueModified(this.meta);
  }

  undoFieldChange(): void {
    this.data[this.field] = angular.copy(this.previousValue);
    makeFieldClean(this.meta);

    let typeModelValue: string = deepGet(this.meta, "type.TYPE_MODEL_VALUE");
    if (isNotNullOrUndefined(typeModelValue) && typeModelValue === "OBJECT") {
      makeAllFieldsClean(this.meta);
    }

    if (isNotNullOrUndefined(this.undoCallback)) {
      this.undoCallback();
    }
  };

  fieldChangeRequiresRestart(): boolean {
    return fieldChangeRequiresRestart(this.meta);
  };
}
