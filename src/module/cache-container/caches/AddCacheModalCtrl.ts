import {IStateService} from "angular-ui-router";
import {ITemplate} from "../../../services/container-config/ITemplate";
import {ICacheContainer} from "../../../services/container/ICacheContainer";
import {CacheService} from "../../../services/cache/CacheService";
import {openErrorModal, openConfirmationModal} from "../../../common/dialogs/Modals";
import IModalService = angular.ui.bootstrap.IModalService;
import {LaunchTypeService} from "../../../services/launchtype/LaunchTypeService";

export class AddCacheModalCtrl {
  static $inject: string[] = ["$state", "$uibModal", "cacheService", "container", "templates", "launchType"];

  newCacheName: string;
  baseTemplate: ITemplate;
  editConfig: boolean = false;
  private noBaseTemplate: ITemplate = {
    name: "<none>",
    type: "<none>"
  };

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private cacheService: CacheService,
              private container: ICacheContainer,
              private templates: ITemplate[],
              private launchType: LaunchTypeService) {
    this.templates.unshift(this.noBaseTemplate);
    this.baseTemplate = this.templates[0];
    if (launchType.isStandaloneLocalMode()) {
      let localTemplates: ITemplate[] = [];
      for (let template of templates) {
        if (template.type === "local-cache" || template.type === "<none>") {
          localTemplates.push(template);
        }
      }
      this.templates = localTemplates;
    }
  }

  isBaseTemplateSelected(): boolean {
    return this.baseTemplate.name !== "<none>";
  }

  displayNextButton(): boolean {
    return this.editConfig || !this.isBaseTemplateSelected();
  }

  createCache(): void {
    if (this.displayNextButton()) {
      this.createCacheAndEdit();
    } else {
      this.createCacheFromTemplate();
    }
  }

  private createCacheAndEdit(): void {
    let params: any = {
      profileName: this.container.profile,
      containerName: this.container.name,
      cacheName: this.newCacheName
    };

    if (this.baseTemplate.name !== "<none>") {
      params.cacheType = this.baseTemplate.type;
      params.baseTemplate = this.baseTemplate.name;
    }
    this.$state.go("new-cache-config", params);
  }

  private createCacheFromTemplate(): void {
    openConfirmationModal(this.$uibModal, "Create " + this.newCacheName + " cache using " + this.baseTemplate.name + " configuration template?")
      .result.then(() => {
      this.cacheService.createCacheFromConfiguration(this.container, this.baseTemplate.type, this.newCacheName,
        this.baseTemplate.name).then(() =>
          this.$state.go("container.caches", {
            profileName: this.container.profile,
            containerName: this.container.name
          }, {
            reload: true
          }),
        error => openErrorModal(this.$uibModal, error));
    });
  }
}
