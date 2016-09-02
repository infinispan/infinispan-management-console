export class ConfirmationModalCtrl {
  static $inject: string[] = ["confirmationMessage", "buttonClass"];

  constructor(public confirmationMessage: string,
              public buttonClass: string) {
  }
}
