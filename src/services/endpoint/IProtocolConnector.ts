import {ISocketBinding} from "../socket-binding/ISocketBinding";
export interface IProtocolConnector {
  name: string;
  type: string;
  "cache-container": string;
  "worker-threads": number;
  "idle-timeout": number;
  "tcp-nodelay": boolean;
  "send-buffer-size": number;
  "receive-buffer-size": number;
  "socket-binding-name": string;
  "socket-binding": ISocketBinding;
}
