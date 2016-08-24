import {IServerAddress} from "./IServerAddress";
export class ServerAddress implements IServerAddress {
  constructor(public host: string, public name: string) {
  }
}
