
import {ICacheContainer} from "../../../services/container/ICacheContainer";
export class ContainerConfigCtrl {

  static $inject: string[] = ["container"];

  constructor(public container: ICacheContainer) {
  }
}
