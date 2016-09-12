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
import IModalService = angular.ui.bootstrap.IModalService;

export class CacheStoreModalButtonCtrl {

  static $inject: string[] = ["$uibModal"];

  data: any;
  field: string;
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
        prevData: (): any => isNullOrUndefined(this.previousValues) ? {} : this.previousValues,
        title: (): string => this.title,
        fields: (): any => this.modalFields
      }
    });

    modal.result.then(storeObject => {
      removeEmptyFieldsFromObject(storeObject, true);
      if (!isEmptyObject(storeObject) && storeObject.modified) {
        delete storeObject.modified;
        this.data[this.field] = storeObject;
        makeFieldDirty(this.parentMeta);
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
