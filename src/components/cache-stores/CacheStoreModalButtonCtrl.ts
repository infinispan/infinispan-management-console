import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import {
  isNullOrUndefined,
  isNotNullOrUndefined,
  deepGet,
  removeEmptyFieldsFromObject,
  isEmptyObject
} from "../../common/utils/Utils";
import {CacheStoreModalCtrl} from "./CacheStoreModalCtrl";
import {makeFieldDirty, makeFieldClean} from "../../common/configuration/ConfigUtil";
import {generateFieldId} from "../directives/IdGeneratorDirective";
import IModalService = angular.ui.bootstrap.IModalService;

export class CacheStoreModalButtonCtrl {

  static $inject: string[] = ["$uibModal"];

  parentId: Function = generateFieldId;
  data: any;
  field: string;
  parent: string;
  fieldMeta: any;
  modalFields: string[];
  previousValues: any;
  parentMeta: any;
  title: string;

  constructor(private $uibModal: IModalService) {
  }

  getStyle(): string {
    return isNullOrUndefined(this.parentMeta) ? "" : this.parentMeta.style;
  }

  openModal(): void {
    let modal: IModalServiceInstance = this.$uibModal.open({
      templateUrl: "components/cache-stores/view/modal-template.html",
      controller: CacheStoreModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        data: (): any => this.resolveDataField(this.data, this.field),
        meta: (): any => this.fieldMeta,
        parent: (): string => this.parent,
        prevData: (): any => isNullOrUndefined(this.previousValues) ? {} : this.previousValues,
        title: (): string => this.title,
        fields: (): any => this.modalFields
      }
    });

    modal.result.then(storeObject => {
      removeEmptyFieldsFromObject(storeObject, true);
      if (!isEmptyObject(storeObject)) {
        this.data[this.field] = storeObject;
        if (storeObject.modified) {
          makeFieldDirty(this.parentMeta);
        }
        delete storeObject.modified;
      }
    }, () => makeFieldClean(this.parentMeta));
  }

  private resolveDataField(data: any, field: string): any {
    if (isNotNullOrUndefined(data)) {
      let object: any = field.indexOf(".") > -1 ? deepGet(data, field) : data[field];
      if (isNotNullOrUndefined(object)) {
        return object;
      }
    }
    let newData: any = {};
    newData[field] = {};
    return newData;
  }
}
