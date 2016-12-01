import {IStateService} from "angular-ui-router";
import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {IDeployPageScope} from "../../../../services/container-config/IDeployPageScope";

export class AddDeploymentModalCtrl {
  static $inject: string[] = ["$state", "containerConfigService"];

  public fileToUpload: File;

  constructor(private $state: IStateService,
              private containerConfigService: ContainerConfigService) {

  }

  uploadAndDeployArtifact(): void {
    this.containerConfigService.uploadAndDeployArtifact(this.fileToUpload)
      .catch(e => console.log("Error in deployment upload of " + this.fileToUpload + ":" + e.toString()))
      .finally(() => this.$state.reload());
  };
}
