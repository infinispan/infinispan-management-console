import {IRole} from "./IRole";

export interface IAuthorization {
  "audit-logger": string;
  mapper: string;
  roles: IRole[];
}
