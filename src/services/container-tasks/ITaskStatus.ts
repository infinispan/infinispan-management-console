import {IServerAddress} from "../server/IServerAddress";

export interface ITaskStatus {
  name: string;
  start: string;
  where: IServerAddress;
}
