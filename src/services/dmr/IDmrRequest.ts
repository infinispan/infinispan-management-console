export interface IDmrRequest {
  async?: boolean;
  "auto-start"?: boolean;
  address: string[];
  blocking?: boolean;
  "cache-name"?: string;
  "cache-names"?: string[];
  category?: string;
  "child-type"?: string;
  configuration?: string;
  "file-contents"?: string[];
  "file-name"?: string;
  "file-names"?: string[];
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
  enabled?: boolean;
  code?: string;
}
