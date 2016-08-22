import {ISocketBinding} from "../socket-binding/ISocketBinding";

export interface IEndpoint {
  "cache-container": string;
  encryption: any; // Todo model this?
  "socket-binding-name": string;
  "socket-binding"?: ISocketBinding;
  name: string;
}
