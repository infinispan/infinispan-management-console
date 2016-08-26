export interface IDmrRequest {
  "auto-start"?: boolean;
  address: string[];
  blocking?: boolean;
  "child-type"?: string;
  group?: string;
  "include-runtime"?: boolean;
  name?: string;
  operation?: string;
  proxies?: boolean;
  recursive?: boolean;
  "recursive-depth"?: number;
  "socket-binding-group"?: string;
  "socket-binding-port-offset"?: number;
  value?: string;
}
