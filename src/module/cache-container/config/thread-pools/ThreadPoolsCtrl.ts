import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {IStateService} from "angular-ui-router";
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {openRestartModal, openErrorModal} from "../../../../common/dialogs/Modals";
import {DomainService} from "../../../../services/domain/DomainService";
import {AbstractConfigurationCtrl} from "../../../../common/configuration/AbstractConfigurationCtrl";
import {deepGet} from "../../../../common/utils/Utils";
import IModalService = angular.ui.bootstrap.IModalService;

export class ThreadPoolsCtrl extends AbstractConfigurationCtrl {

  static $inject: string[] = ["$state", "$uibModal", "domainService", "containerConfigService", "container", "threadPools",
    "meta"];

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private domainService: DomainService,
              private containerConfigService: ContainerConfigService,
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
          openRestartModal(this.$uibModal).result.then(() => this.domainService.restartAllServers());
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
