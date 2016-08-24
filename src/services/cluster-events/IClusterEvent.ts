import {IServerAddress} from "../server/IServerAddress";
export interface IClusterEvent {
  category: string;
  context: string;
  level: string;
  message: string;
  server: IServerAddress;
  when: string;
}
