import {ICache} from "../cache/ICache";
import {IEndpoint} from "../endpoint/IEndpoint";
import {IServerGroup} from "../server-group/IServerGroup";

export interface ICacheContainer {
  name: string;
  profile: string;
  serverGroup: IServerGroup;
  availability: string;
  numberOfCaches: number;
  endpoints: IEndpoint[];
  members: string[];
  stack: string;
  sites: string;
}
