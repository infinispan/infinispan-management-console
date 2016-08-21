import IScope = angular.IScope;
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import {UtilsService} from "../../services/utils/UtilsService";

export class ErrorModalCtrl {

  static $inject: string[] = ["$modalInstance", "utils", "errorMsg"];

  errorText: string;
  errorTextDetail: string;

  constructor(private $modalInstance: IModalServiceInstance, private utils: UtilsService,
              private errorMsg: any) {
    if (typeof errorMsg === "string") {
      this.errorText = "An error has occurred:";
      this.errorTextDetail = errorMsg;
    } else {
      utils.traverse(errorMsg, (key: string, value: any, trail: any[]) => {
        this.errorText = trail[0];
        this.errorTextDetail = value;
      });
    }
  }

  ok(): void {
    this.$modalInstance.close();
  }
}
