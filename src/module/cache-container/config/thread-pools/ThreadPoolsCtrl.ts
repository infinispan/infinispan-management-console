import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {IStateService} from "angular-ui-router";
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {openRestartModal, openErrorModal, openConfirmationModal} from "../../../../common/dialogs/Modals";
import {AbstractConfigurationCtrl} from "../../../../common/configuration/AbstractConfigurationCtrl";
import {deepGet} from "../../../../common/utils/Utils";
import IModalService = angular.ui.bootstrap.IModalService;
import {LaunchTypeService} from "../../../../services/launchtype/LaunchTypeService";
import {ServerGroupService} from "../../../../services/server-group/ServerGroupService";

export class ThreadPoolsCtrl extends AbstractConfigurationCtrl {

  static $inject: string[] = ["$state", "$uibModal", "serverGroupService", "containerConfigService", "launchType", "container", "threadPools",
    "meta"];

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private serverGroupService: ServerGroupService,
              private containerConfigService: ContainerConfigService,
              private launchType: LaunchTypeService,
              private container: ICacheContainer,
              public threadPools: any,
              public meta: any) {
    super();
    this.meta = deepGet(this.meta, "children.thread-pool.model-description");
  }

  save(): void {
    this.containerConfigService.saveThreadPools(this.container, this.threadPools)
      .then(() => {
        if (this.isRestartRequired()) {
          if (this.launchType.isStandaloneMode()) {
            openConfirmationModal(this.$uibModal, "Config changes will only be made available after you manually restart the server!");
          } else {
            openRestartModal(this.$uibModal).result.then(() => this.serverGroupService.restartServers(this.container.serverGroup));
          }
        }
        this.cleanMetaData();
      }, error => openErrorModal(this.$uibModal, error));
  }

  cancel(): void {
    this.$state.go("container", {
      profileName: this.container.profile,
      containerName: this.container.name
    });
  }
}
