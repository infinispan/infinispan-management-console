import {IServerAddress} from "../server/IServerAddress";

export interface IDomain {
  controller: string;
  servers: IServerAddress[]; // Map of format hostname: [server1, server2]
}
