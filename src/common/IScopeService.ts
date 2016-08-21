import {IRootScopeService} from "./IRootScopeService";
export interface IScope extends IRootScopeService {
  $root: IRootScopeService;
}
