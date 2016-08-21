import IScope = angular.IScope;
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;

export class InfoModalCtrl {

  static $inject: string[] = ["$modalInstance"];

  constructor(private $modalInstance: IModalServiceInstance, public infoText: string, public infoTextDetail: string) {}

  ok(): void {
    // TODO restart cluster
    this.$modalInstance.close();
  }
}
