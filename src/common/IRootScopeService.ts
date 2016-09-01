import {IPage} from "./IPage";

export interface IRootScopeService extends ng.IRootScopeService {
  page: IPage;
  isDomainControllerAlive: boolean;
  safeApply: Function;
}
