export interface IDmrRequest {
  "auto-start"?: boolean;
  address: string[];
  blocking?: boolean;
  category?: string;
  "child-type"?: string;
  group?: string;
  "include-runtime"?: boolean;
  name?: string;
  operation?: string;
  proxies?: boolean;
  recursive?: boolean;
  "recursive-depth"?: number;
  "site-name"?: string;
  "socket-binding-group"?: string;
  "socket-binding-port-offset"?: number;
  value?: string;
}
