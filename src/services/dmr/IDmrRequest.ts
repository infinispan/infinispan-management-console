export interface IDmrRequest {
  address: string[];
  "child-type"?: string;
  "include-runtime"?: boolean;
  name?: string;
  operation?: string;
  proxies?: string;
  recursive?: boolean;
  "recursive-depth"?: number;
  value?: string;
}
