export interface IServerAddress {
  host: string;
  name: string;
  equals(other: IServerAddress): boolean;
  toString(): string;
}
