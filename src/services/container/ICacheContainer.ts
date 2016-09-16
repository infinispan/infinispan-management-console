import {IEndpoint} from "../endpoint/IEndpoint";
import {IServerGroup} from "../server-group/IServerGroup";
import {IAuthorization} from "../security/IAuthorization";

export interface ICacheContainer {
  name: string;
  profile: string;
  serverGroup: IServerGroup;
  available: boolean;
  numberOfCaches: number;
  endpoints: IEndpoint[];
  authorization: IAuthorization;
  "online-sites": string[];
  "offline-sites": string[];
  "mixed-sites": string[];
}
