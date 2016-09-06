export interface ITransport {
  channel: string;
  "initial-cluster-size": number;
  "initial-cluster-timeout": number;
  "lock-timeout": number;
  "strict-peer-to-peer": boolean;
}
