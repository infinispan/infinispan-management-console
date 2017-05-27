import {IConfigurationCallback} from "../../common/configuration/IConfigurationCallback";
import {getMetaForResource} from "../../common/configuration/ConfigUtil";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {deepGet} from "../../common/utils/Utils";
import {ModalService} from '../../services/modal/ModalService';

export class EndpointConfigurationCtrl {

  endpointType: string;
  data: any;
  meta: any;
  initDefaults: boolean;
  readOnly: boolean;
  readOnlyFields: string[];
  configCallbacks: IConfigurationCallback[];

  public newSni: any;

  listConfig: any = {
    selectItems: false,
    multiSelect: false,
    dblClick: false,
    dragEnabled: false,
    dragEnd: false,
    dragMoved: false,
    dragStart: false,
    selectionMatchProp: 'data',
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

  static $inject: string[] = ["modalService"];

  constructor(public modalService: ModalService) {
    this.newSni = {
      hostName: '',
      securityRealm: '',
      sniName: ''
    };
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

  openAddSniModal():void {
    // TODO: ADD SNI
    //console.log(this.newSni);
    this.modalService.openSniModal(this.data.encryption.ENCRYPTION).then(done=> {
      console.log("Completed add sni");
    });
  }

  parseSniToArray(sniObject) {
    return Object.keys(sniObject).reduce((acc, tally, index) => {
      acc[index] = {
        name: tally,
        data: sniObject[tally]
      };
      return acc;
    }, {});
  }
}
