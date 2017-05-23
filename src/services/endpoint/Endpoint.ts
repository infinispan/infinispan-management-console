import {IEndpoint} from "./IEndpoint";
import {IProtocolConnector} from "./IProtocolConnector";
import {isNotNullOrUndefined, deepGet} from "../../common/utils/Utils";
import {ISocketBinding} from "../socket-binding/ISocketBinding";

export class Endpoint implements IEndpoint {

  private connector: IProtocolConnector;

  constructor(private namePath: string [], private data: any, private socketBinding: ISocketBinding) {
    this.connector = <IProtocolConnector> {
      name: isNotNullOrUndefined(namePath) && namePath.length > 1 ? namePath[1] : "N/A",
      "type": isNotNullOrUndefined(namePath) && namePath.length > 0 ? namePath[0] : undefined,
      "cache-container": data["cache-container"],
      "socket-binding-name": data["socket-binding"],
      "worker-threads": data["worker-threads"],
      "idle-timeout": data["idle-timeout"],
      "tcp-nodelay": data["tcp-nodelay"],
      "send-buffer-size": data["end-buffer-size"],
      "receive-buffer-size": data["receive-buffer-size"],
      "socket-binding": undefined
    };
  }

  getType(): string {
    return this.connector['type'];
  }

  getName(): string {
    return this.connector.name;
  }

  getCacheContainer(): string {
    return this.connector["cache-container"];
  }

  getSocketBindingName(): string {
    return isNotNullOrUndefined(this.getSocketBinding()) ? this.getSocketBinding().name : this.connector['socket-binding-name'];
  }

  setSocketBinding(binding: ISocketBinding): void {
    this.socketBinding = binding;
  }

  getSocketBinding(): ISocketBinding {
    return this.socketBinding;
  }

  hasSocketBinding(): boolean {
    return isNotNullOrUndefined(this.socketBinding);
  }

  getEncryption(): any {
    return this.data['encryption'];
  }

  isMultiTenant(): boolean {
    return isNotNullOrUndefined(this.data["hotrod-socket-binding"]) || isNotNullOrUndefined(this.data["rest-socket-binding"]);
  }

  getObject(path: string): any {
    return deepGet(this.data, path);
  }

  getDMR(): any {
    return this.data;
  }

  toString(): string {
    return this.connector.name.toString();
  }
}
