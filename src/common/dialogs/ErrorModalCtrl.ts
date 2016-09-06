import {traverse, isString} from "../utils/Utils";

export class ErrorModalCtrl {

  static $inject: string[] = ["error"];

  errorText: string;
  errorTextDetail: string;

  constructor(private error: any) {
    if (isString(error)) {
      this.errorText = "An error has occurred:";
      this.errorTextDetail = error;
    } else {
      traverse(error, (key: string, value: any, trail: any[]) => {
        this.errorText = trail[0];
        this.errorTextDetail = value;
      });
    }
  }
}
