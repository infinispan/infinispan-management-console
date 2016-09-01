import {IServerAddress} from "../server/IServerAddress";
export interface IClusterEvent {
  category: string;
  context: string;
  detail: string;
  level: string;
  message: string;
  server: IServerAddress;
  when: string;
  who: any;
}
