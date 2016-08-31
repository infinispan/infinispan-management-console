import {IServer} from "./IServer";
import {IServerAddress} from "./IServerAddress";
export class Server implements IServer {
  constructor(public address: IServerAddress, public state: string,
              public inetAddress: string, public profileName: string, public serverGroup: string) {
  }

  equals(other: IServer): boolean {
    return this.address.equals(other.address);
  }

  isStopped(): boolean {
    return this.state.toUpperCase() === "STOPPED";
  }

  isRunning(): boolean {
    return this.state.toUpperCase() === "RUNNING";
  }

  toString(): string {
    return this.address.toString();
  }
}
