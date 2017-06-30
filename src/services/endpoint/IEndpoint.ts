import {ISocketBinding} from "../socket-binding/ISocketBinding";

export interface IEndpoint {
  getName(): string;
  getType(): string;
  getProfileName(): string;
  getCacheContainer(): string;
  getSocketBindingName(): string;
  setSocketBinding(binding: ISocketBinding): void;
  getEncryption(): any;
  getSocketBinding(): ISocketBinding;
  hasSocketBinding(): boolean;
  isMultiTenant(): boolean;
  getObject(path: string): any;
  getDMR(): any;
}
