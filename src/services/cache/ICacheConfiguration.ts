export interface ICacheConfiguration {
  batching: boolean;
  "capacity-factor": number;
  configuration: string; // name
  "jndi-name": string;
  "l1-lifespan": number;
  mode: string;
  module: string;
  owners: number;
  "remote-cache": string;
  "remote-site": string;
  "remote-timeout": number;
  segments: number;
  "simple-cache": boolean;
  start: string;
  statistics: boolean;
  "statistics-available": boolean;
  template: boolean;

  backup: any;
  "binary-keyed-jdbc-store": any;
  "cluster-loader": any;
  compatibility: any;
  eviction: any;
  expiration: any;
  "file-store": any;
  indexing: any;
  "leveldb-store": any;
  loader: any;
  locking: any;
  "mixed-keyed-jdbc-store": any;
  "partition-handling": any;
  "remote-store": any;
  "rest-store": any;
  security: any;
  "state-transfer": any;
  store: any;
  "string-keyed-jdbc-store": any;
  transaction: any;
}
