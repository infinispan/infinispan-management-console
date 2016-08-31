import {IServerAddress} from "./IServerAddress";
export interface IServer {
  address: IServerAddress;
  state: string;
  inetAddress: string;
  profileName: string;
  serverGroup: string;
  isStopped(): boolean;
  isRunning(): boolean;
  equals(other: IServer): boolean;
  toString(): string;
}
