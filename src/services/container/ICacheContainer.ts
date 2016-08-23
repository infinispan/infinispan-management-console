import {IEndpoint} from "../endpoint/IEndpoint";
import {IServerGroup} from "../server-group/IServerGroup";

export interface ICacheContainer {
  name: string;
  profile: string;
  serverGroup: IServerGroup;
  available: boolean;
  numberOfCaches: number;
  endpoints: IEndpoint[];
  stack: string;
  "online-sites": string[];
  "offline-sites": string[];
  "mixed-sites": string[];
}
