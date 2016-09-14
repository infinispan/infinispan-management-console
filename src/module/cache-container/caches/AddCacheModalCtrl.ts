import {IStateService} from "angular-ui-router";
import {ITemplate} from "../../../services/container-config/ITemplate";
import {ICacheContainer} from "../../../services/container/ICacheContainer";
import {CacheService} from "../../../services/cache/CacheService";
import {openErrorModal} from "../../../common/dialogs/Modals";
import IModalService = angular.ui.bootstrap.IModalService;

export class AddCacheModalCtrl {
  static $inject: string[] = ["$state", "$uibModal", "cacheService", "container", "templates"];

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
              public templates: ITemplate[]) {
    this.templates.unshift(this.noBaseTemplate);
    this.baseTemplate = this.templates[0];
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
    this.cacheService.createCacheFromConfiguration(this.container, this.baseTemplate.type, this.newCacheName,
      this.baseTemplate.name)
      .then(() => this.$state.go("container.caches", {
          profileName: this.container.profile,
          containerName: this.container.name
        }, {
          reload: true
        }),
        error => openErrorModal(this.$uibModal, error));
  }
}
