import {IServerAddress} from "./IServerAddress";
export class ServerAddress implements IServerAddress {
  constructor(public host: string, public name: string) {
  }

  equals(other: IServerAddress): boolean {
    return this.host === other.host && this.name === other.name;
  }

  toString(): string {
    return this.host + ":" + this.name;
  }
}
