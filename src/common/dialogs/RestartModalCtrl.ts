import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;

export class RestartModalCtrl {

  static $inject: string[] = ["$modalInstance"];

  requiresRestartFlag: boolean;

  constructor(private $modalInstance: IModalServiceInstance) {}

  ok(): void {
    // TODO restart cluster
    this.requiresRestartFlag = false;
  }

  cancel(): void {
    this.$modalInstance.close();
  }
}
