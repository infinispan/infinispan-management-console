import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {IStateService} from "angular-ui-router";
import {ITransport} from "../../../../services/container-config/ITransport";
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {openRestartModal, openErrorModal, openConfirmationModal} from "../../../../common/dialogs/Modals";
import {DomainService} from "../../../../services/domain/DomainService";
import IModalService = angular.ui.bootstrap.IModalService;
import {AbstractConfigurationCtrl} from "../../../../common/configuration/AbstractConfigurationCtrl";
import {LaunchTypeService} from "../../../../services/launchtype/LaunchTypeService";

export class TransportConfigCtrl extends AbstractConfigurationCtrl {

  static $inject: string[] = ["$state", "$uibModal", "domainService", "launchType", "containerConfigService", "container", "transport",
    "meta"];

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private domainService: DomainService,
              private launchType: LaunchTypeService,
              private containerConfigService: ContainerConfigService,
              private container: ICacheContainer,
              public transport: ITransport,
              public meta: any) {
    super();
  }

  save(): void {
    this.containerConfigService.saveTransport(this.container, this.transport)
      .then(() => {
        if (this.launchType.isStandaloneLocalMode()) {
          openConfirmationModal(this.$uibModal, "Config changes will only be made available after you manually restart the server!");
        } else {
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
