import {IDmrRequest} from "./IDmrRequest";

export interface IDmrCompositeReq {
  address: string [];
  operation: string;
  steps: IDmrRequest[];
}
