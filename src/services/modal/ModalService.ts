import {App} from "../../ManagementConsole";
import IModalService = angular.ui.bootstrap.IModalService;
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import {ICacheContainer} from "./../container/ICacheContainer";
import {ServerService} from "../../services/server/ServerService";
import {ServerGroupService} from "../server-group/ServerGroupService";
import {ContainerService} from "../../services/container/ContainerService";
import {ConfirmationModalCtrl} from "./../../module/server-group/nodes/ConfirmationModalCtrl";
import {BootingModalCtrl} from "./../../module/server-group/BootingModalCtrl";
import {IServerGroup} from "../server-group/IServerGroup";
import {openConfirmationModal} from "../../common/dialogs/Modals";
import {SiteManagementModalCtrl} from "../../module/cache-container/SiteManagementModalCtrl";
import {AddEndpointModalCtrl} from "../../module/server-group/endpoints/AddEndpointModalCtrl";

const module: ng.IModule = App.module("managementConsole.services.modal", []);

export class ModalService {

  static $inject: string[] = ["$uibModal", "serverGroupService", "serverService", "containerService"];

  constructor(private $uibModal: IModalService,
              private serverGroupService: ServerGroupService,
              private serverService: ServerService,
              private containerService: ContainerService) {
  }

  public openServerConfirmationModal(operation:string, serverGroup: IServerGroup): ng.IPromise<any> {
    let bootModal: IModalServiceInstance = null;
    return this.$uibModal.open({
      templateUrl: "module/server-group/nodes/view/confirmation-modal.html",
      controller: ConfirmationModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        operation: (): string => {
          return operation;
        },
        clusterName: (): string => {
          return serverGroup.name;
        }
      }
    }).result.then(() => {
      // If we get here, then we know the modal was submitted
      if (operation === "start") {
        bootModal = this.createBootingModal(operation, serverGroup.name);
        return this.serverGroupService.startServers(serverGroup);
      } else if (operation === "restart") {
        bootModal = this.createBootingModal(operation, serverGroup.name);
        return this.serverGroupService.restartServers(serverGroup);
      } else if (operation === "reload") {
        bootModal = this.createBootingModal(operation, serverGroup.name);
        return this.serverGroupService.reloadServers(serverGroup);
      } else if (operation === "stop") {
        bootModal = this.createStoppingModal();
        return this.serverGroupService.stopServers(serverGroup);
      }
    }).then(data => {
    bootModal.close();
    return {
      data: data,
      action: "Finished"
    };
    }).catch(err => ({error: err, action: "Cancelled"}));
  }

  public createBootingModal(operation: string, serverGroupName: string): IModalServiceInstance {
    return this.$uibModal.open({
      templateUrl: "module/server-group/nodes/view/booting-modal.html",
      controller: BootingModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        operation: (): string => {
          return operation;
        },
        clusterName: (): string => {
          return serverGroupName;
        }
      }
    });
  }

  public createStoppingModal(): IModalServiceInstance {
    return this.$uibModal.open({
      templateUrl: "module/server-group/nodes/view/stopping-modal.html"
    });
  }

  public createRebalanceModal(enableRebalance: boolean, message: string, container: ICacheContainer): ng.IPromise<any> {
    return openConfirmationModal(this.$uibModal, message).result.then(() => {
      return enableRebalance ? this.containerService.enableRebalance(container) : this.containerService.disableRebalance(container);
    });
  }

  public openEndpointModal(endpointType: string, serverGroup: string): ng.IPromise<any> {
    return this.$uibModal.open({
      templateUrl: "module/server-group/endpoints/view/add-endpoint-modal.html",
      controller: AddEndpointModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        endpointType: (): string => endpointType,
        serverGroup: ["serverGroupService", (serverGroupService) =>
          serverGroupService.getServerGroupMapWithMembers(serverGroup)
        ]
      }
    }).result;
  }

  public createCachesSiteModal(cacheContainer: ICacheContainer): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/view/manage-sites-modal.html",
      controller: SiteManagementModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        container: (): ICacheContainer => {
          return cacheContainer;
        },
        siteArrays: (): ng.IPromise<{[id: string]: string[]}> => {
          return this.containerService.getSiteArrays(cacheContainer);
        }
      },
      size: "lg"
    });
  }
}

module.service("modalService", ModalService);
