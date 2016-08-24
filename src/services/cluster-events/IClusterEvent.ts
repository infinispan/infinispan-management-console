import {IServerAddress} from "../server/IServerAddress";
export interface IClusterEvent {
  context: string;
  level: string;
  message: string;
  server: IServerAddress;
  when: string;
}
