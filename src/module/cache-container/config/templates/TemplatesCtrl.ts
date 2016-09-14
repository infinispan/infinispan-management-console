import {ITemplate} from "../../../../services/container-config/ITemplate";
import {openConfirmationModal} from "../../../../common/dialogs/Modals";
import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {AddTemplateModalCtrl} from "./AddTemplateModalCtrl";
import {IStateService} from "angular-ui-router";
import {CacheConfigService} from "../../../../services/cache-config/CacheConfigService";
import IModalService = angular.ui.bootstrap.IModalService;

export class TemplatesCtrl {
  static $inject: string[] = ["$state", "$uibModal", "cacheConfigService", "container", "templates"];

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private cacheConfigService: CacheConfigService,
              private container: ICacheContainer,
              public templates: ITemplate[]) {
  }

  createTemplate(): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/config/templates/view/add-template-modal.html",
      controller: AddTemplateModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        container: (): ICacheContainer => this.container,
        templates: (): ITemplate[] => this.templates
      }
    });
  }

  editTemplate(template: ITemplate): void {
    this.$state.go("edit-cache-template", {
      profileName: this.container.profile,
      containerName: this.container.name,
      templateType: template.type,
      templateName: template.name
    });
  }

  removeTemplate(template: ITemplate, templateIndex: number): void {
    // confirmation dialog and then remove
    let message: string = "Remove template '" + template.name + "'?";
    openConfirmationModal(this.$uibModal, message, "pficon pficon-delete")
      .result
      .then(() => this.cacheConfigService.removeConfiguration(this.container, template.type, template.name))
      .then(() => this.templates.splice(templateIndex, 1));
  }
}
