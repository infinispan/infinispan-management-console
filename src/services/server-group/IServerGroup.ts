import {IServerAddress} from "../server/IServerAddress";
export interface IServerGroup {
  name: string;
  profile: string;
  "socket-binding-group": string;
  "socket-binding-port-offset": number;
  members: IServerAddress[];
}
