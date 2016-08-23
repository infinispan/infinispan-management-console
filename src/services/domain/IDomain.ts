import {IMap} from "../utils/IDictionary";

export interface IDomain {
  controller: string;
  servers: IMap<string[]>; // Map of format hostname: [server1, server2]
}
