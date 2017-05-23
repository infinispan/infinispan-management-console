import {IConfigurationCallback} from "../../common/configuration/IConfigurationCallback";
import {getMetaForResource} from "../../common/configuration/ConfigUtil";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {deepGet} from "../../common/utils/Utils";

export class EndpointConfigurationCtrl {

  endpointType: string;
  //container: ICacheContainer;
  data: any;
  meta: any;
  initDefaults: boolean;
  readOnly: boolean;
  readOnlyFields: string[];
  configCallbacks: IConfigurationCallback[];

  listConfig: any = {
    selectItems: false,
    multiSelect: false,
    dblClick: false,
    dragEnabled: false,
    dragEnd: false,
    dragMoved: false,
    dragStart: false,
    selectionMatchProp: 'name',
    selectedItems: [],
    itemsAvailable: true,
    checkDisabled: false,
    showSelectBox: false,
    useExpandingRows: false,
    onSelect: false,
    onSelectionChange: false,
    onCheckBoxChange: false,
    onClick: false,
    onDblClick: false
  };


  traverse(): void {

  }

  getTemplateUrl(): string {
    return "components/endpoint-configuration/view/" + this.endpointType + ".html";
  }

  getMetaForResource(resource: string): any {
    return deepGet(this.meta, resource.concat(".attributes"));
  }

  getMetaRootForResource(resource: string): any {
    return deepGet(this.meta, resource);
  }
}
