import {getArraySize} from "../../common/utils/Utils";
import {ContainerService} from "../../services/container/ContainerService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {openConfirmationModal} from "../../common/dialogs/Modals";
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import IModalService = angular.ui.bootstrap.IModalService;

export class SiteManagementModalCtrl {
  static $inject: string[] = ["$uibModal", "containerService", "container", "siteArrays"];

  onlineSites: string[];
  offlineSites: string[];
  mixedSites: string[];

  errorExecuting: boolean = false;
  errorDescription: string = "";
  successfulOperation: boolean = false;

  constructor(private $uibModal: IModalService,
              private containerService: ContainerService,
              private container: ICacheContainer,
              private siteArrays: {[id: string]: string[]}) {
    this.initSites(siteArrays);
  }

  initSites(siteArrays: {[id: string]: string[]}): void {
    this.onlineSites = siteArrays["sites-online"];
    this.offlineSites = siteArrays["sites-offline"];
    this.mixedSites = siteArrays["sites-mixed"];
  }

  isSitesEmpty(): boolean {
    return getArraySize(this.onlineSites) + getArraySize(this.offlineSites) + getArraySize(this.mixedSites) < 1;
  }

  refresh(): void {
    this.containerService.getSiteArrays(this.container)
      .then(sites => {
          this.initSites(sites);
        },
        error => {
          this.errorExecuting = true;
          this.errorDescription = error;
        }
      );
  }

  executeSiteOperation(siteName: string, operation: string, message: string): void {
    let modal: IModalServiceInstance = openConfirmationModal(this.$uibModal, message);

    modal.result.then(() => {
      this.containerService.executeSiteOperation(operation, siteName, this.container)
        .then(() => {
          this.successfulOperation = true;
          this.refresh();
        }, error => {
          this.errorExecuting = true;
          this.errorDescription = error;
          this.refresh();
        });
    });
  }
}
