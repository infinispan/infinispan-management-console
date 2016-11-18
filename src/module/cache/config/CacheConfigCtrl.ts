import {ICacheContainer} from "../../../services/container/ICacheContainer";
import {CacheConfigService} from "../../../services/cache-config/CacheConfigService";
import {IStateService} from "angular-ui-router";
import {isNotNullOrUndefined, isNonEmptyString} from "../../../common/utils/Utils";
import {openErrorModal, openRestartModal, openConfirmationModal} from "../../../common/dialogs/Modals";
import {AbstractConfigurationCtrl} from "../../../common/configuration/AbstractConfigurationCtrl";
import {CacheService} from "../../../services/cache/CacheService";
import IModalService = angular.ui.bootstrap.IModalService;
import {LaunchTypeService} from "../../../services/launchtype/LaunchTypeService";
import {ServerGroupService} from "../../../services/server-group/ServerGroupService";

export class CacheConfigCtrl extends AbstractConfigurationCtrl {
  static $inject: string[] = ["$state", "$scope", "$uibModal", "serverGroupService", "launchType", "cacheService", "cacheConfigService",
    "container", "template", "meta", "cacheName"];

  profile: string;
  containerName: string;
  readOnlyFields: string[];

  private typeChangeCancelled: boolean = false;

  constructor(private $state: IStateService,
              private $scope: ng.IScope,
              private $uibModal: IModalService,
              private serverGroupService: ServerGroupService,
              private launchType: LaunchTypeService,
              private cacheService: CacheService,
              private cacheConfigService: CacheConfigService,
              private container: ICacheContainer,
              public template: any,
              public meta: any,
              public cacheName: string) {
    super();
    this.profile = container.profile;
    this.containerName = container.name;
    this.readOnlyFields = this.isEditMode() ? ["type", "template-name"] : ["template-name"];
    this.$scope.$watch("ctrl.template.type", (newType: string, oldType: string) => {
      if (newType !== oldType) {
        if (this.typeChangeCancelled) {
          this.typeChangeCancelled = false;
        } else {
          this.reloadMetaAndDataOnTypeChange(newType, oldType);
        }
      }
    });
  }

  goToContainerCachesView(): void {
    this.$state.go("container.caches", {
      profileName: this.profile,
      containerName: this.containerName
    });
  }

  isEditMode(): boolean {
    return this.$state.current.name === "edit-cache-config";
  }

  isTemplateNameEmpty(): boolean {
    let templateName: string = this.template["template-name"];
    return !(isNotNullOrUndefined(templateName) && isNonEmptyString(templateName));
  }

  createCache(): void {
    this.cacheService.createCacheAndConfiguration(this.container, this.template.type, this.template["template-name"], this.template)
      .then(() => this.goToContainerCachesView(), error => openErrorModal(this.$uibModal, error));
  }

  updateTemplate(): void {
    this.cacheConfigService.updateCacheConfiguration(this.container, this.template.type, this.template["template-name"], this.template)
      .then(() => {
          if (this.launchType.isStandaloneLocalMode()) {
            openConfirmationModal(this.$uibModal, "Config changes will only be made available after you manually restart the server!");
          } else {
            openRestartModal(this.$uibModal).result.then(() => this.serverGroupService.restartServers(this.container.serverGroup));
          }
          this.cleanMetaData();
        },
        error => openErrorModal(this.$uibModal, error));
  }

  private reloadMetaAndDataOnTypeChange(newType: string, oldType: string): void {
    if (this.typeChangeCancelled) {
      return;
    }

    let newParams: any = this.$state.params;
    newParams.templateName = this.template["template-name"];
    newParams.baseType = newType;
    let message: string = "Changing a configurations template type will reset all previously entered fields. Proceed?";
    openConfirmationModal(this.$uibModal, message).result
      .then(() => this.$state.go(this.$state.current, newParams),
        () => {
          this.typeChangeCancelled = true;
          this.template.type = oldType;
        });
  }
}
