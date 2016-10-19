import {ICacheContainer} from "../../../services/container/ICacheContainer";
import {LaunchTypeService} from "../../../services/launchtype/LaunchTypeService";
export class ContainerConfigCtrl {

  static $inject: string[] = ["container", "launchType"];

  constructor(public container: ICacheContainer, private launchType: LaunchTypeService) {
  }

  public isDomainMode(): boolean {
    return this.launchType.isDomainMode();
  }

  public isStandaloneLocalMode(): boolean {
    return this.launchType.isStandaloneLocalMode();
  }
}
