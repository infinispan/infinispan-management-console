import {IStateService} from "angular-ui-router";
import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {IDeployPageScope} from "../../../../services/container-config/IDeployPageScope";

export class AddDeploymentModalCtrl {
  static $inject: string[] = ["$state", "$scope", "container", "containerConfigService"];

  constructor(private $state: IStateService,
              private $scope: IDeployPageScope,
              private container: ICacheContainer,
              private containerConfigService: ContainerConfigService) {

  }

  uploadAndDeployArtifact(): void {
    this.containerConfigService.uploadAndDeployArtifact(this.$scope.fileToUpload)
      .catch((e) => {
        console.log("Error in deployment upload of " + this.$scope.fileToUpload + ":" + e.toString());
      })
      .finally(() => {
        this.$state.reload();
      });
  };
}
