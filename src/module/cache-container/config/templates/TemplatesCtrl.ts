import {ITemplate} from "../../../../services/container-config/ITemplate";
import {openConfirmationModal} from "../../../../common/dialogs/Modals";
import IModalService = angular.ui.bootstrap.IModalService;
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {AddTemplateModalCtrl} from "./AddTemplateModalCtrl";

export class TemplatesCtrl {
  static $inject: string[] = ["$uibModal", "containerConfigService", "container", "templates"];

  constructor(private $uibModal: IModalService,
              private containerConfigService: ContainerConfigService,
              private container: ICacheContainer,
              public templates: ITemplate[]) {
  }

  createTemplate(): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/config/templates/view/add-template-modal.html",
      controller: AddTemplateModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        templates: (): string[] => this.templates.map(template => template.name)
      }
    });

    // TODO on response transition to new template screen
  }

  editTemplate(template: ITemplate): void {
    // Go to edit template page
  }

  removeTemplate(template: ITemplate, templateIndex: number): void {
    // confirmation dialog and then remove
    let message: string = "Remove template '" + template.name + "'?";
    openConfirmationModal(this.$uibModal, message, "pficon pficon-delete")
      .result
      .then(() => this.containerConfigService.removeContainerTemplate(this.container, template))
      .then(() => this.templates.splice(templateIndex, 1));
  }
}
