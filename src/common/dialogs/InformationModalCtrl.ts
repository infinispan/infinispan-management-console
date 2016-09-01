export class InformationModalCtrl {

  static $inject: string[] = ["header", "information"];

  constructor(public header: string,
              public information: string) {
  }
}
