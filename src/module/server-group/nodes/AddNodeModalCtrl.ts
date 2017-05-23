import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import {ServerAddress} from "../../../services/server/ServerAddress";
import {INewServerInstance} from "../../../services/server/INewServerInstance";

export class AddNodeModalCtrl {
  static $inject: string[] = ["$uibModalInstance", "hosts"];

  host: string;
  serverName: string = "";
  portOffset: number = 0;

  constructor(private $uibModalInstance: IModalServiceInstance, public hosts: string[]) {
    this.host = hosts[0];
  }

  close(): void {
    this.$uibModalInstance.close(<INewServerInstance>{
      address: new ServerAddress(this.host, this.serverName),
      portOffset: this.portOffset
    });
  }
}
