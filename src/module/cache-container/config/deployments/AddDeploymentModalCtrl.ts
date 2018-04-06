import {IStateService} from "angular-ui-router";
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";

export class AddDeploymentModalCtrl {
  static $inject: string[] = ["$state", "containerConfigService"];

  public fileToUpload: File;

  constructor(private $state: IStateService,
              private containerConfigService: ContainerConfigService) {

  }

  uploadAndDeployArtifact(): void {
    this.containerConfigService.uploadAndDeployArtifact(this.fileToUpload)
      .catch(e => console.error("Error in deployment upload of " + this.fileToUpload + ":" + e.toString()))
      .finally(() => this.$state.reload());
  };
}
