import {IConfigurationCallback} from "../../common/configuration/IConfigurationCallback";
import {isNotNullOrUndefined, isNullOrUndefined} from "../../common/utils/Utils";
import {
  isFieldValueModified,
  fieldChangeRequiresRestart,
  makeFieldClean,
  makeFieldDirty
} from "../../common/configuration/ConfigUtil";

const CACHE_LOADERS: {class: string, label: string}[] = [
  {
    class: "None",
    label: "No Cache Loader"
  },
  {
    class: "org.infinispan.persistence.async.AsyncCacheLoader",
    label: "Async Cache Loader"
  },
  {
    class: "org.infinispan.persistence.async.AdvancedAsyncCacheLoader",
    label: "Advanced Async Cache Loader"
  },
  {
    class: "org.infinispan.persistence.jdbc.binary.JdbcBinaryStore",
    label: "Binary Based JDBC Store"
  },
  {
    class: "org.infinispan.persistence.cluster.ClusterLoader",
    label: "Cluster Loader"
  },
  {
    class: "",
    label: "Custom Loader"
  },
  {
    class: "org.infinispan.persistence.jpa.JpaStore",
    label: "JPA Store"
  },
  {
    class: "org.infinispan.persistence.leveldb.LevelDBStore",
    label: "LevelDB Store"
  },
  {
    class: "org.infinispan.persistence.jdbc.mixed.JdbcMixedStore",
    label: "Mixed JDBC Store"
  },
  {
    class: "org.infinispan.persistence.remote.RemoteStore",
    label: "Remote Store"
  },
  {
    class: "org.infinispan.persistence.rest.RestStore",
    label: "Rest Store"
  },
  {
    class: "org.infinispan.persistence.file.SingleFileStore",
    label: "Single File Store"
  },
  {
    class: "org.infinispan.persistence.sifs.SoftIndexFileStore",
    label: "Soft Index File Store"
  },
  {
    class: "org.infinispan.persistence.jdbc.stringbased.JdbcStringBasedStore",
    label: "String Based JDBC Store"
  }
];

export class CacheLoadersCtrl implements IConfigurationCallback {

  data: any;
  meta: any;
  readOnly: boolean;
  configCallbacks: IConfigurationCallback[];
  cacheLoaders: {class: string, label: string}[];

  fields: string[];
  allFields: string[];
  prevData: any;
  type: {type: string};

  constructor() {
    this.cacheLoaders = CACHE_LOADERS;
    this.fields = ["preload", "shared"];
    this.allFields = this.fields.concat("class");

    if (isNotNullOrUndefined(this.configCallbacks)) {
      this.configCallbacks.push(this);
    }

    this.prevData = {};
    this.data = isNullOrUndefined(this.data) ? {} : this.data;
    this.data["is-new-node"] = isNullOrUndefined(this.data["class"]);
    this.type = {
      type: this.getStoreType(this.data.class)
    };
    this.cleanMetadata();
  }

  // We have to use () => notation so that the use of "this" in the callback is bound to CacheLoadersCtrl's state
  changeLoaderClass: Function = () => {
    this.data.class = isNullOrUndefined(this.type.type) ? null : angular.copy(this.type.type);

    let meta: any = this.meta.class;
    let original: any = this.prevData.class;
    let latest: any = this.data.class;
    let customLoaderSelected: boolean = latest === "" && isNullOrUndefined(original);
    let noValueOrPrevData: boolean = (isNullOrUndefined(original) || original === "") && !latest;

    if (!customLoaderSelected && noValueOrPrevData || original === latest) {
      makeFieldClean(meta);
    } else {
      makeFieldDirty(meta);
    }
  };

  undoClassChange: Function = () => {
    this.undoFieldChange("class");
    this.type.type = this.getStoreType(this.data.class);
  };

  isCustomLoader(): boolean {
    /* tslint:disable:triple-equals */
    if (isNotNullOrUndefined(this.type.type) && this.type.type.length == 0) {
      return true;
    } else {
      return !this.cacheLoaders.some(loader => loader.class !== this.data.class);
    }
  }

  isAnyFieldModified(): boolean {
    return this.allFields.some(attrName => isFieldValueModified(this.meta[attrName]));
  }

  isRestartRequired(): boolean {
    return this.allFields.some(attrName => isFieldValueModified(this.meta[attrName]) && fieldChangeRequiresRestart(this.meta[attrName]));
  }

  cleanMetadata(): void {
    this.allFields.forEach(attrName => {
      makeFieldClean(this.meta[attrName]);
      this.prevData[attrName] = angular.copy(this.data[attrName]);
      this.prevData.type = isNullOrUndefined(this.type) ? "None" : this.type.type;
      makeFieldClean(this.meta["class"]);
    });
  }

  getStyle(field: string): string {
    return isNotNullOrUndefined(this.meta[field]) ? this.meta[field].style : "";
  }

  private undoFieldChange(field: string): void {
    this.data[field] = this.prevData[field];
    makeFieldClean(this.meta[field]);
  }

  private getStoreType(classVal: string): string {
    if (isNullOrUndefined(classVal)) {
      return "None";
    } else {
      let nonCustomStore: boolean = this.cacheLoaders.some(loader => loader.class === classVal);
      return nonCustomStore ? classVal : "";
    }
  }
}
