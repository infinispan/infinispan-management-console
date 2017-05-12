import IModalService = angular.ui.bootstrap.IModalService;
import {IServerGroup} from "../../../services/server-group/IServerGroup";
import {IEndpoint} from "../../../services/endpoint/IEndpoint";
import {isNotNullOrUndefined} from "../../../common/utils/Utils";
import {ModalService} from "./../../../services/modal/ModalService";

export class EndpointsCtrl {
  static $inject: string[] = ["$uibModal", "serverGroup", "endpoints", "modalService"];

  constructor(private $uibModal: IModalService,
              private serverGroup: IServerGroup,
              private endpoints: IEndpoint[],
              private modalService: ModalService) {
  }

  isMultiTenantRouter(endpoint: IEndpoint): boolean {
    return isNotNullOrUndefined(endpoint) &&
      endpoint.isMultiTenant();
  }

  createEndpointAndEdit(type: string): void {
    this.modalService.openEndpointModal(`${type}-connector`, this.serverGroup.name);
  }
}
