export interface IDmrRequest {
  async?: boolean;
  "auto-start"?: boolean;
  address: string[];
  blocking?: boolean;
  "cache-name"?: string;
  category?: string;
  "child-type"?: string;
  group?: string;
  "include-runtime"?: boolean;
  name?: string;
  operation?: string;
  parameters?: any;
  proxies?: boolean;
  recursive?: boolean;
  "recursive-depth"?: number;
  "site-name"?: string;
  "socket-binding-group"?: string;
  "socket-binding-port-offset"?: number;
  value?: string;
}
