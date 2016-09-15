import {IStateService} from "angular-ui-router";
import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {IDeployPageScope} from "../../../../services/container-config/IDeployPageScope";

export class ConfirmDeploymentModalCtrl {
  static $inject: string[] = ["$state", "$scope", "container", "containerConfigService", "artifact", "mode"];

  constructor(private $state: IStateService,
              private $scope: IDeployPageScope,
              private container: ICacheContainer,
              private containerConfigService: ContainerConfigService,
              private artifact: string,
              private mode: string) {
  }

  confirmDeployArtifact(): void {
    this.containerConfigService.deployArtifact(this.container, this.artifact)
      .catch((e) => {
        console.log("Error in deploy " + e.toString());
      })
      .finally(() => {
        this.$state.reload();
      });
  }

  confirmUndeployArtifact(): void {
    this.containerConfigService.undeployArtifact(this.container, this.artifact)
      .catch((e) => {
        console.log("Error in undeploy " + e.toString());
      })
      .finally(() => {
        this.$state.reload();
      });
  }

  confirmRemoveArtifact(): void {
    this.containerConfigService.removeArtifact(this.container, this.artifact)
      .catch((e) => {
        console.log("Error in remove " + e.toString());
      })
      .finally(() => {
        this.$state.reload();
      });
  }

  isDeploy(): boolean {
    return this.mode === "deploy";
  }

  isUndeploy(): boolean {
    return this.mode === "undeploy";
  }

  isRemove(): boolean {
    return this.mode === "remove";
  }
}
