import {UtilsService} from "../utils/UtilsService";
import {ICache} from "../ICache";
import {ICacheConfiguration} from "./ICacheConfiguration";
export class Cache implements ICache {

  configModel: ICacheConfiguration;
  private utils: UtilsService; // TODO remove when utils is exposed statically

  constructor(public name: string,
              public type: string,
              public configName: string) {
    this.utils = new UtilsService();
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
    return this.utils.isNotNullOrUndefined(this.configModel.eviction);
  }

  isIndexed(): boolean {
    return this.utils.isNotNullOrUndefined(this.configModel.indexing);
  }

  isPersistent(): boolean {
    let persistentFields: string[] = ["file-store", "leveldb-store", "rest-store", "store", "binary-keyed-jdbc-store",
      "string-keyed-jdbc-store", "mixed-keyed-jdbc-store"];
    return persistentFields.some(field => this.utils.isNotNullOrUndefined(this.configModel[field]));
  }

  isSecured(): boolean {
    let auth: any = this.utils.deepValue(this.configModel, "security.SECURITY.authorization.AUTHORIZATION");
    return this.utils.isNotNullOrUndefined(auth) && auth.enabled;
  }

  isTransactional(): boolean {
    let transaction: any = this.utils.deepValue(this.configModel, "transcation.TRANSCTION.mode");
    return this.utils.isNotNullOrUndefined(transaction) && transaction !== "NONE";
  }

  hasCompatibility(): boolean {
    return this.utils.isNotNullOrUndefined(this.configModel.compatibility);
  }

  hasRemoteBackup(): boolean {
    return this.utils.isNotNullOrUndefined(this.configModel.backup);
  }
}
