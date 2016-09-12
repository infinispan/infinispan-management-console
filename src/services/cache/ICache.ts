import {ICacheConfiguration} from "../cache-config/ICacheConfiguration";

export interface ICache {
  name: string;
  type: string;
  configName: string;
  configModel?: ICacheConfiguration;

  isDistributed(): boolean;

  isLocal(): boolean;

  isReplicated(): boolean;

  isInvalidation(): boolean;

  isBounded(): boolean;

  isIndexed(): boolean;

  isPersistent(): boolean;

  isSecured(): boolean;

  isTransactional(): boolean;

  hasCompatibility(): boolean;

  hasRemoteBackup(): boolean;
}
