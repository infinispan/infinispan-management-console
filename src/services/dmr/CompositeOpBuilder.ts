import {IDmrRequest} from "./IDmrRequest";
import {IDmrCompositeReq} from "./IDmrCompositeReq";

export function createWriteAttrReq(address: string[], name: string, value: any): IDmrRequest {
  return {
    address: address,
    operation: "write-attribute",
    name: name,
    value: value
  };
}

export function createRemoveReq(address: string[]): IDmrRequest {
  return {
    address: address,
    operation: "remove"
  };
}

export class CompositeOpBuilder {

  private address: string[] = [];
  private steps: IDmrRequest[] = [];

  add(request: IDmrRequest): CompositeOpBuilder {
    this.steps.push(request);
    return this;
  }

  build(): IDmrCompositeReq {
    return {
      address: this.address,
      operation: "composite",
      steps: this.steps
    };
  }
}
