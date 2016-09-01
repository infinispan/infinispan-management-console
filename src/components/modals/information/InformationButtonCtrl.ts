import IModalService = angular.ui.bootstrap.IModalService;
import {openInfoModal} from "../../../common/dialogs/Modals";

export class InformationButtonCtrl {
  static $inject: string[] = ["$uibModal"];

  header: string;
  information: string;

  constructor(private $uibModal: IModalService) {
  }

  openModal(): void {
    openInfoModal(this.$uibModal, this.header, this.information);
  }
}
