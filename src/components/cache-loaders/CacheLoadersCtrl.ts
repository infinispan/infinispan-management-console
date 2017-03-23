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
    class: "org.infinispan.persistence.cluster.ClusterLoader",
    label: "Cluster Loader"
  },
  {
    class: "",
    label: "Custom Loader"
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

  getStoreLabel(): string {
    return this.cacheLoaders.filter((loader) => loader.class === this.type.type)[0].label;
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
