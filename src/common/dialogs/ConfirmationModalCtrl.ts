export class ConfirmationModalCtrl {
  static $inject: string[] = ["confirmationMessage"];

  constructor(public confirmationMessage: string) {
  }
}
