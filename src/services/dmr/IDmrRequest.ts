export interface IDmrRequest {
  address: string[];
  "child-type"?: string;
  "include-runtime"?: boolean;
  name?: string;
  operation?: string;
  proxies?: boolean;
  recursive?: boolean;
  "recursive-depth"?: number;
  value?: string;
}
