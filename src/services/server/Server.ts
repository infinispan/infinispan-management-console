import {IServer} from "./IServer";
import {IServerAddress} from "./IServerAddress";

export const SERVER_STATE_STOPPED: string = "STOPPED";
export const SERVER_STATE_RUNNING: string = "RUNNING";
export const SERVER_STATE_RELOAD_REQUIRED: string = "RELOAD-REQUIRED";
export const SERVER_STATE_RESTART_REQUIRED: string = "RESTART-REQUIRED";

export class Server implements IServer {
  constructor(public address: IServerAddress, public state: string,
              public inetAddress: string, public profileName: string, public serverGroup: string) {
  }

  equals(other: IServer): boolean {
    return this.address.equals(other.address);
  }

  isStopped(): boolean {
    return this.state.toUpperCase() === SERVER_STATE_STOPPED;
  }

  isRunning(): boolean {
    return this.state.toUpperCase() === SERVER_STATE_RUNNING;
  }

  isReloadRequired(): boolean {
    return this.state.toUpperCase() === SERVER_STATE_RELOAD_REQUIRED;
  }
  isRestartRequired(): boolean {
    return this.state.toUpperCase() === SERVER_STATE_RESTART_REQUIRED;
  }

  toString(): string {
    return this.address.toString();
  }
}
