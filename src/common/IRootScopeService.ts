import {IPage} from "./IPage";
import {IConstants} from "../constants";

export interface IRootScopeService extends ng.IRootScopeService {
  constants: IConstants;
  page: IPage;
  isDomainControllerAlive: boolean;
  safeApply: Function;
}
