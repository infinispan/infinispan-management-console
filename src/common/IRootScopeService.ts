import {IPage} from "./IPage";

export interface IRootScopeService extends ng.IRootScopeService {
  page: IPage;
  isDomainControllerAlive: boolean;
  openErrorModal: Function;
  openRestartModal: Function;
  openInfoModal: Function;
  safeApply: Function;
}
