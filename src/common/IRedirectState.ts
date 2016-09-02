import {IState} from "angular-ui-router";
export interface IRedirectState extends IState {
  redirectTo: string;
}
