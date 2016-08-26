import {IServerAddress} from "./IServerAddress";

export interface INewServerInstance {
  address: IServerAddress;
  portOffset: number;
  "server-group": string;
  "socket-binding-group": string;
  // TODO add optional JVM args
}
