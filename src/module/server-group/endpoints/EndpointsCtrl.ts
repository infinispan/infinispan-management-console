import IModalService = angular.ui.bootstrap.IModalService;
import {IServerGroup} from "../../../services/server-group/IServerGroup";
import {IEndpoint} from "../../../services/endpoint/IEndpoint";
import {AddEndpointModalCtrl} from "./AddEndpointModalCtrl";
import {isNotNullOrUndefined} from "../../../common/utils/Utils";
import {EndpointService} from "../../../services/endpoint/EndpointService";
import {CompositeOpBuilder} from "../../../services/dmr/CompositeOpBuilder";
import {DmrService} from "../../../services/dmr/DmrService";
import {IStateService} from "angular-ui-router";
import {ModalService} from './../../../services/modal/ModalService';

export class EndpointsCtrl {
  static $inject: string[] = ["$state", "endpointService", "dmrService", "serverGroup", "endpoints", "modalService"];



  constructor(private $state: IStateService,
              private endpointService: EndpointService,
              private dmrService: DmrService,
              private serverGroup: IServerGroup,
              private endpoints: IEndpoint[],
              private modalService: ModalService){
  }

  isEndpointEnabled(endpoint: IEndpoint): boolean {
    return true;
  }

  isEndpointDisabled(endpoint: IEndpoint): boolean {
    return !this.isEndpointEnabled(endpoint);
  }

  isMultiTenantRouter(endpoint: IEndpoint): boolean {
    return isNotNullOrUndefined(endpoint) &&
      endpoint.isMultiTenant();
  }

  createEndpointAndEdit(type: string): void {
    let params: any = {
      endpointType: type + "-connector",
      endpointName: "random_" + type,
      serverGroup: this.serverGroup.name
    };

    this.modalService.openEndpointModal(`${type}-connector`, this.serverGroup.name);
    // this.$state.go("new-endpoint-config", params);
  }
}
