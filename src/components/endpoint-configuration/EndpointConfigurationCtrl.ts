import {IConfigurationCallback} from "../../common/configuration/IConfigurationCallback";
import {deepGet} from "../../common/utils/Utils";

export class EndpointConfigurationCtrl {

  endpointType: string;
  data: any;
  meta: any;
  initDefaults: boolean;
  readOnly: boolean;
  readOnlyFields: string[];
  configCallbacks: IConfigurationCallback[];

  getTemplateUrl(): string {
    return "components/endpoint-configuration/view/" + this.endpointType + ".html";
  }

  getMetaForResource(resource: string): any {
    return deepGet(this.meta, resource.concat(".attributes"));
  }
}
