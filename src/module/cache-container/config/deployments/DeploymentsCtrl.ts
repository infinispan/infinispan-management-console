import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {IStateService} from "angular-ui-router";
import {CacheConfigService} from "../../../../services/cache-config/CacheConfigService";
import IModalService = angular.ui.bootstrap.IModalService;
import {AddDeploymentModalCtrl} from "./AddDeploymentModalCtrl";
import {ConfirmDeploymentModalCtrl} from "./ConfirmDeploymentModalCtrl";
import IScope = angular.IScope;
import {isNotNullOrUndefined} from "../../../../common/utils/Utils";

export class DeploymentsCtrl {

  static $inject: string[] = ["$state", "$scope", "$uibModal", "cacheConfigService", "container", "deployments", "deployed"];
  private deployedArtifacts: { [key: string]: boolean; } = {};

  constructor(private $state: IStateService,
              private $scope: IScope,
              private $uibModal: IModalService,
              private cacheConfigService: CacheConfigService,
              private container: ICacheContainer,
              private deployments: any[],
              private deployed: any[]) {
    for (let entry of deployed) {
      this.deployedArtifacts[entry.result.name] = entry.result;
    }
  }

  openUploadModal(): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/config/deployments/view/upload-artifact-modal.html",
      controller: AddDeploymentModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        container: (): ICacheContainer => this.container
      }
    });
  }

  openConfirmationModal(artifact: string, mode:string): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/config/deployments/view/confirmation-modal.html",
      controller: ConfirmDeploymentModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        container: (): ICacheContainer => this.container,
        artifact: (): string => artifact,
        mode: (): string => mode
      }
    });
  }

  canDeploy(artifactName: string): boolean {
    let artifact: any = this.deployedArtifacts[artifactName];
    if (isNotNullOrUndefined(artifact)) {
      return artifact.enabled;
    } else {
      return false;
    }
  }

  canUndeploy(artifactName: string): boolean {
    return !this.canDeploy(artifactName);
  }

  artifactType(artifactName: string): string {
    let artifactExtension:string = artifactName.split(".").pop();
    return artifactExtension.toUpperCase();
  }
};
