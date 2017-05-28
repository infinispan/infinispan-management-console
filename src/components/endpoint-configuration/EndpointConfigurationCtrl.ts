import {IConfigurationCallback} from "../../common/configuration/IConfigurationCallback";
import {getMetaForResource} from "../../common/configuration/ConfigUtil";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {deepGet} from "../../common/utils/Utils";
import {ModalService} from '../../services/modal/ModalService';
import {isNotNullOrUndefined, isNullOrUndefined} from "../../common/utils/Utils";
import {deepValue} from "../../common/utils/Utils";

export class EndpointConfigurationCtrl {

  endpointType: string;
  data: any;
  meta: any;
  initDefaults: boolean;
  readOnly: boolean;
  readOnlyFields: string[];
  configCallbacks: IConfigurationCallback[];

  public newSni: any;
  public newHotrod: any;
  public hasChanged: boolean = false;

  public paths = {
    'rest': 'multi-tenancy.MULTI_TENANCY.rest',
    'hotrod': 'multi-tenancy.MULTI_TENANCY.hotrod',
    'encryption': 'encryption.ENCRYPTION',
    'encryptionSni': 'encryption.ENCRYPTION.sni'
  }
  public newRestConnectorProps = [{
    name: 'Connector name',
    propName: 'connectorName'
  }, {
    name: 'Name',
    propName: 'name'
  }];

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

    this.newHotrod = {
      name:'',
      hotrod: ''
    };

    this.data = this.checkAndFixPath(this.data, this.paths.rest);
    this.data = this.checkAndFixPath(this.data, this.paths.hotrod);
    this.data = this.checkAndFixPath(this.data, this.paths.encryption);

    Object.keys(deepGet(this.data, this.paths.rest) || {}).forEach(rest => {
      this.fillOneNode(deepGet(this.data, this.paths.rest), rest);
    });

    Object.keys(deepGet(this.data, this.paths.hotrod) || {}).forEach(hotrod => {
      this.fillOneNode(deepGet(this.data, this.paths.hotrod), hotrod);
      if (deepValue(this.data, `${this.paths.hotrod}.${hotrod}.sni`)) {
        Object.keys(deepValue(this.data, `${this.paths.hotrod}.${hotrod}.sni`)).forEach(hr => {
          this.fillOneNode(deepGet(this.data, `${this.paths.hotrod}.${hotrod}.sni`), hr);
        });
      }
    });

    Object.keys(deepGet(this.data, this.paths.encryptionSni) || {}).forEach(sni => {
      if (deepGet(this.data, this.paths.encryptionSni)) {
        this.fillOneNode(deepGet(this.data, this.paths.encryptionSni), sni);
      }
    });
  }

  private createHash(node) {
    return Object.keys(node).reduce((acc, tally) => {
      const seed = (typeof tally === 'object' ? Object.keys(tally).length : tally);
      return acc === '' ? `${node[seed]}` : `${acc}-${node[seed]}`;
    }, '').concat(`-${(new Date()).getTime()}`);
  }

  public fillOneNode(tree, node) {
    tree[node].hash = this.createHash(tree[node]);
    tree[node].nodeName = node;
  }

  public fillNodes(tree, path) {
    return Object.keys(deepValue(tree, path)).reduce((tree, node, index) => {
      this.fillOneNode(tree, node);
      return tree;
    }, deepValue(tree, path));
  };

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

  public addNewHotrod() { 
    this.data['multi-tenancy'].MULTI_TENANCY.hotrod[this.newHotrod.hotrod] = {
      name: this.newHotrod.name,
      sni: {}
    };

    this.fillOneNode(this.data['multi-tenancy'].MULTI_TENANCY.hotrod, this.newHotrod.hotrod);
    this.newHotrod = {
      hotrod: '',
      name: ''
    };

    this.hasChanged = true;
  }

   public addNewSniToMultiTenancyHotrod($event) {
     if (!this.data['multi-tenancy'].MULTI_TENANCY.hotrod[$event.parent.nodeName].sni) {
       this.data['multi-tenancy'].MULTI_TENANCY.hotrod[$event.parent.nodeName].sni = {};
     }
     this.data['multi-tenancy'].MULTI_TENANCY.hotrod[$event.parent.nodeName].sni[$event.name] = {
       'host-name': $event.hostName,
       'security-realm': $event.securityRealm
     };
     this.fillOneNode(this.data['multi-tenancy'].MULTI_TENANCY.hotrod[$event.parent.nodeName].sni, $event.name);
   }

   public addNewSniToHotrod($event) {
      $event.parent.sni[$event.name] = {
        'host-name': $event.hostName,
        'security-realm': $event.securityRealm
      }
      this.fillOneNode($event.parent.sni, $event.name);
   }

   public addNewConnectorToRest($event) {
     $event.parent[$event.newItem.connectorName] = {
       'name': $event.newItem.name,
       'prefix': ''
     };
     this.createHash($event.parent[$event.newItem.connectorName]);
   }

   public removeItem($event) {
     console.log(deepGet(this.data, $event.path), $event);
     const parent = deepGet(this.data, $event.path);
     if (Object.keys(parent).filter(item => parent.hash === $event.hash)[0]) {
       console.log(`Deleting ${$event.nodeName}`);
       delete parent[$event.item.nodeName];
     }


   }

   private concatPath(path, index) {
     return path.reduce((acc, tally, position) => {
       if (position <= index) {
          return acc === '' ? tally : acc.concat(`.${tally}`);
       }
       return acc;
     }, '');
   }

   public checkAndFixPath(tree, path) {
     if (!deepGet(tree, path)) {
        return path.split('.').reduce((tree, node, index, nodes) => {
          if (index === 0 && !deepGet(tree, this.concatPath(nodes, 0))) {
            tree[node] = {}
          } else if (index > 0 && !deepGet(tree, this.concatPath(nodes, index))) {
            deepValue(tree, this.concatPath(nodes, index - 1))[node] = {}; 
          }
          return tree;
        }, tree);
     } else {
      return tree;
     }
   }
}
