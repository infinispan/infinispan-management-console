import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import {traverse} from "../utils/Utils";

export class ErrorModalCtrl {

  static $inject: string[] = ["$modalInstance", "errorMsg"];

  errorText: string;
  errorTextDetail: string;

  constructor(private $modalInstance: IModalServiceInstance,
              private errorMsg: any) {
    if (typeof errorMsg === "string") {
      this.errorText = "An error has occurred:";
      this.errorTextDetail = errorMsg;
    } else {
      traverse(errorMsg, (key: string, value: any, trail: any[]) => {
        this.errorText = trail[0];
        this.errorTextDetail = value;
      });
    }
  }

  ok(): void {
    this.$modalInstance.close();
  }
}
