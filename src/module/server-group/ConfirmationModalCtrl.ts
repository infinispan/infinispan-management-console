export class ConfirmationModalCtrl {
  static $inject: string[] = ["operation", "clusterName"];

  constructor(public operation: string, public clusterName: string) {
  }
}
