import {IStateService} from "angular-ui-router";
import {AbstractConfigurationCtrl} from "../../../common/configuration/AbstractConfigurationCtrl";
import IModalService = angular.ui.bootstrap.IModalService;
import {LaunchTypeService} from "../../../services/launchtype/LaunchTypeService";
import {ServerGroupService} from "../../../services/server-group/ServerGroupService";
import {IServerGroup} from "../../../services/server-group/IServerGroup";
import {IEndpoint} from "../../../services/endpoint/IEndpoint";
import {openConfirmationModal, openErrorModal, openRestartModal} from "../../../common/dialogs/Modals";
import {EndpointService} from "../../../services/endpoint/EndpointService";

export class EndpointConfigCtrl extends AbstractConfigurationCtrl {
  static $inject: string[] = ["$state", "$scope", "$uibModal", "serverGroupService", "endpointService", "launchType",
    "serverGroup", "endpoint", "endpointMeta", "endpointType", "endpointName"];

  readOnlyFields: string[];

  constructor(private $state: IStateService,
              private $scope: ng.IScope,
              private $uibModal: IModalService,
              private serverGroupService: ServerGroupService,
              private endpointService: EndpointService,
              private launchType: LaunchTypeService,
              private serverGroup: IServerGroup,
              private endpoint: IEndpoint,
              private endpointMeta: any,
              private endpointType: string,
              private endpointName: string) {
    super();
    this.readOnlyFields = ["name"];
  }

  goToEndpointsView(): void {
    this.$state.go("server-group.endpoints", {serverGroup: this.serverGroup.name});
  }

  isEditMode(): boolean {
    return this.$state.current.name === "edit-endpoint-config";
  }

  createEndpoint(endpoint: IEndpoint): void {
    openConfirmationModal(this.$uibModal, "Create endpoint " + this.endpoint.getName() + "?").result.then(() => {
      this.endpointService.create(endpoint)
        .then(() => this.confirmEndpointsModal(),
          error => openErrorModal(this.$uibModal, error));
    });
  }

  updateEndpoint(endpoint: IEndpoint): void {
    let message: string = this.isEditMode() ? "Update endpoint " + this.endpoint.getName() + "?" : "Create endpoint " + this.endpoint.getName() + "?";
    openConfirmationModal(this.$uibModal, message).result.then(() => {
      this.endpointService.update(endpoint)
        .then(() => this.confirmEndpointsModal(),
          error => openErrorModal(this.$uibModal, error));
    });
  }

  confirmEndpointsModal(): void {
    if (this.launchType.isStandaloneMode()) {
      openConfirmationModal(this.$uibModal,
        "Config changes will only be made available after you manually restart the server!").result.then(() => {
        this.goToEndpointsView();
      }, () => {
        this.goToEndpointsView();
      });
    } else {
      openRestartModal(this.$uibModal).result.then(() => {
        this.serverGroupService.restartServers(this.serverGroup).then(() => this.goToEndpointsView());
      }, () => {
        this.goToEndpointsView();
      });
    }
    this.cleanMetaData();
  }
}
