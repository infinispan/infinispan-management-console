import {IStateService} from "angular-ui-router";
import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {IDeployPageScope} from "../../../../services/container-config/IDeployPageScope";
import {IRole} from "../../../../services/security/IRole";
import {isNotNullOrUndefined} from "../../../../common/utils/Utils";
import {openErrorModal} from "../../../../common/dialogs/Modals";
import IModalService = angular.ui.bootstrap.IModalService;

export class SecurityModalCtrl {

  static $inject: string[] = ["$state", "$scope", "$uibModal", "container", "containerConfigService", "role", "isNewRole"];
  private permissions: { [key: string]: boolean; } = {};

  constructor(private $state: IStateService,
              private $scope: IDeployPageScope,
              private $uibModal: IModalService,
              private container: ICacheContainer,
              private containerConfigService: ContainerConfigService,
              private role: IRole,
              private isNewRole: boolean) {
    if (isNotNullOrUndefined(role)) {
      angular.forEach(role.permissions, (value: string) => {
        this.permissions[value] = true;
      });
    }
  }

  createNewRole(): void {
    this.role.permissions = this.convertPermissions();
    this.containerConfigService.addRole(this.container, this.role).then(() => {
      this.$state.reload();
    }).catch((e) => {
      this.openErrorModal("Could not create new security role due to " + e.toString());
    });
  };

  editExistingRole(): void {
    this.role.permissions = this.convertPermissions();
    this.containerConfigService.editRole(this.container, this.role).then(() => {
      this.$state.reload();
    }).catch((e) => {
      this.openErrorModal("Could not edit security role due to " + e.toString());
    });
  };

  private convertPermissions(): string[] {
    let permissionsArray: string[] = [];
    angular.forEach(this.permissions, (value: boolean, key: string) => {
      if (value) {
        permissionsArray.push(key);
      }
    });
    return permissionsArray;
  }

  private openErrorModal(error: string): void {
    openErrorModal(this.$uibModal, error);
  }
}
