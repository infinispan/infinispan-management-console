import {ICache} from "./ICache";
import {ICacheConfiguration} from "../cache-config/ICacheConfiguration";
import {isNotNullOrUndefined, deepValue} from "../../common/utils/Utils";

export class Cache implements ICache {

  configModel: ICacheConfiguration;
  cardStatus: any;

  constructor(public name: string,
              public type: string,
              public configName: string) {
  }

  isDistributed(): boolean {
    return this.type === "distributed-cache";
  }

  isLocal(): boolean {
    return this.type === "local-cache";
  }

  isReplicated(): boolean {
    return this.type === "replicated-cache";
  }

  isInvalidation(): boolean {
    return this.type === "invalidation-cache";
  }

  isBounded(): boolean {
    return isNotNullOrUndefined(this.configModel) && isNotNullOrUndefined(this.configModel.eviction);
  }

  isIndexed(): boolean {
    return isNotNullOrUndefined(this.configModel) && isNotNullOrUndefined(this.configModel.indexing);
  }

  isPersistent(): boolean {
    let persistentFields: string[] = ["file-store", "rocksdb-store", "rest-store", "store", "string-keyed-jdbc-store"];
    return persistentFields.some(field => isNotNullOrUndefined(this.configModel) && isNotNullOrUndefined(this.configModel[field]));
  }

  isSecured(): boolean {
    let auth: any = deepValue(this.configModel, "security.SECURITY.authorization.AUTHORIZATION");
    return isNotNullOrUndefined(auth) && auth.enabled;
  }

  isTransactional(): boolean {
    let transaction: any = deepValue(this.configModel, "transaction.TRANSACTION.mode");
    return isNotNullOrUndefined(transaction) && transaction !== "NONE";
  }

  hasCompatibility(): boolean {
    return isNotNullOrUndefined(this.configModel) && isNotNullOrUndefined(this.configModel.compatibility);
  }

  hasRemoteBackup(): boolean {
    return isNotNullOrUndefined(this.configModel) && isNotNullOrUndefined(this.configModel.backup);
  }
}
