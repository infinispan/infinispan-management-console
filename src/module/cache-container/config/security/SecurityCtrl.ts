import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {IStateService} from "angular-ui-router";
import IModalService = angular.ui.bootstrap.IModalService;
import IScope = angular.IScope;
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {openErrorModal, openConfirmationModal} from "../../../../common/dialogs/Modals";
import {isNotNullOrUndefined} from "../../../../common/utils/Utils";
import {SecurityModalCtrl} from "./SecurityModalCtrl";
import {IRole} from "../../../../services/security/IRole";

export class SecurityCtrl {

  static $inject: string[] = ["$state", "$scope", "$uibModal", "containerConfigService", "container", "securityConfig"];
  public securityAuthorizationDefined: boolean;
  public mappers: string[];
  public roles: IRole[];

  constructor(private $state: IStateService,
              private $scope: IScope,
              private $uibModal: IModalService,
              private containerConfigService: ContainerConfigService,
              private container: ICacheContainer,
              private securityConfig: any) {
    this.securityAuthorizationDefined = isNotNullOrUndefined(securityConfig) && isNotNullOrUndefined(securityConfig.authorization);
    if (this.securityAuthorizationDefined) {
      this.mappers = [];
      this.mappers.push(securityConfig.authorization.AUTHORIZATION.mapper);
      this.roles = <IRole[]>securityConfig.authorization.AUTHORIZATION.role;
    }
  }

  openAddRoleModal(): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/config/security/view/add-role-modal.html",
      controller: SecurityModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        container: (): ICacheContainer => this.container,
        role: (): IRole => {
          return <IRole>{};
        },
        isNewRole: (): boolean => {
          return true;
        }
      }
    });
  }

  openEditRoleModal(role: IRole): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/config/security/view/add-role-modal.html",
      controller: SecurityModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        container: (): ICacheContainer => this.container,
        role: (): IRole => {
          return role;
        },
        isNewRole: (): boolean => {
          return false;
        }
      }
    });
  }

  openRemoveRoleModal(role: IRole): void {
    let message: string = "Remove role '" + role.name + "'?";
    openConfirmationModal(this.$uibModal, message, "pficon pficon-delete")
      .result
      .then(() => {
        this.containerConfigService.removeRole(this.container, role).then(() => {
          this.$state.reload();
        });
      }).catch((e) => {
      this.openErrorModal("Could not remove role due to " + e.toString());
    });
  }

  defineAuthorization(): void {
    this.containerConfigService.addSecurity(this.container).then(() => {
      this.containerConfigService.addAuthorization(this.container).then(() => {
        this.mappers = ["org.infinispan.security.impl.IdentityRoleMapper"];
        this.securityAuthorizationDefined = true;
      });
    }).catch((e) => {
      this.openErrorModal("Could not define security due to " + e.toString());
    });
  }

  private openErrorModal(error: string): void {
    openErrorModal(this.$uibModal, error);
  }
}
