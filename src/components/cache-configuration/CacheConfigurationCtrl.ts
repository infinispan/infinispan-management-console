import {IConfigurationCallback} from "../../common/configuration/IConfigurationCallback";
import {getMetaForResource} from "../../common/configuration/ConfigUtil";

export class CacheConfigurationCtrl {

  cacheType: string;
  data: any;
  meta: any;
  initDefaults: boolean;
  readOnly: boolean;
  configCallbacks: IConfigurationCallback[];
  editMode: boolean;

  readOnlyFields: string[];

  constructor() {
    if (this.editMode) {
      this.readOnlyFields = ["type", "template-name"];
    }
  }

  getTemplateUrl(): string {
    return "components/cache-configuration/view/" + this.cacheType + ".html";
  }

  getMetaForResource(resource: string): any {
    return getMetaForResource(this.meta, resource);
  }
}
