import {IServerGroup} from "../../services/server-group/IServerGroup";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {IServerAddress} from "../../services/server/IServerAddress";
import {JGroupsService} from "../../services/jgroups/JGroupsService";
import {IStateService} from "angular-ui-router";
import {AddNodeModalCtrl} from "./AddNodeModalCtrl";
import {ServerService} from "../../services/server/ServerService";
import {ConfirmationModalCtrl} from "./ConfirmationModalCtrl";
import {DmrService} from "../../services/dmr/DmrService";
import {IMap} from "../../common/utils/IMap";
import {isEmptyObject, isNotNullOrUndefined, isNullOrUndefined} from "../../common/utils/Utils";
import {openErrorModal} from "../../common/dialogs/Modals";
import IModalService = angular.ui.bootstrap.IModalService;
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";

export class ServerGroupCtrl {
  static $inject: string[] = ["$state", "$uibModal", "dmrService", "serverGroupService", "serverService",
    "jGroupsService", "launchType", "serverGroup", "available"];

  status: string = "DEGRADED";
  serverStatusMap: IMap<string> = {};
  serverInetMap: IMap<string> = {};
  coordinator: IServerAddress;
  hosts: string[];

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private dmrService: DmrService,
              private serverGroupService: ServerGroupService,
              private serverService: ServerService,
              private jGroupsService: JGroupsService,
              private launchType: LaunchTypeService,
              public serverGroup: IServerGroup,
              public available: boolean) {
    this.fetchSGCoordinator();
    this.fetchServerStatuses();
    this.fetchInetAddresses();
    this.hosts = this.filterUniqueHosts();
    this.status = available ? "STARTED" : "DEGRADED";
  }

  isCoordinator(server: IServerAddress): boolean {
    return (this.coordinator) ? this.coordinator.equals(server) : false;
  }

  isServerStopped(server: IServerAddress): boolean {
    return false;
  }

  getSGStatus(): string {
    return this.status;
  }

  getServerStatus(server: IServerAddress): string {
    if (isEmptyObject(this.serverStatusMap)) {
      return "";
    }
    return this.serverStatusMap[server.toString()];
  }

  getServerInetAddress(server: IServerAddress): string {
    if (isEmptyObject(this.serverInetMap) || isNullOrUndefined(server)) {
      return "";
    }
    return this.serverInetMap[server.toString()];
  }

  refresh(): void {
    this.dmrService.clearGetCache();
    this.$state.reload();
  }

  createServerModal(): void {
    let modal: IModalServiceInstance = this.$uibModal.open({
      templateUrl: "module/server-group/view/add-node-modal.html",
      controller: AddNodeModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        hosts: (): string[] => {
          return this.hosts;
        }
      }
    });

    let bootModal: IModalServiceInstance = undefined;
    modal.result
      .then((newServer) => {
        newServer["server-group"] = this.serverGroup.name;
        newServer["socket-binding-group"] = this.serverGroup["socket-binding-group"];
        return this.serverService.createServer(newServer)
          .then(() => {
            bootModal = this.createBootingModal();
            return this.serverService.startServer(newServer.address);
          });
      })
      .finally(() => {
        if (isNotNullOrUndefined(bootModal)) {
          bootModal.close();
        }
        this.refresh();
      });
  }

  createBootingModal(): IModalServiceInstance {
    return this.$uibModal.open({
      templateUrl: "module/server-group/view/booting-modal.html"
    });
  }

  createStoppingModal(): IModalServiceInstance {
    return this.$uibModal.open({
      templateUrl: "module/server-group/view/stopping-modal.html"
    });
  }

  createConfirmationModal(operation: string): void {
    let modal: IModalServiceInstance = this.$uibModal.open({
      templateUrl: "module/server-group/view/confirmation-modal.html",
      controller: ConfirmationModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        operation: (): string => {
          return operation;
        }
      }
    });

    let bootModal: IModalServiceInstance = undefined;
    modal.result
      .then(() => {
        // If we get here, then we know the modal was submitted
        if (operation === "start") {
          bootModal = this.createBootingModal();
          return this.serverGroupService.startServers(this.serverGroup);
        } else {
          bootModal = this.createStoppingModal();
          return this.serverGroupService.stopServers(this.serverGroup);
        }
      })
      .then(() => {
        bootModal.close();
        this.refresh();
      })
      .catch(error => openErrorModal(this.$uibModal, error));
  }

  isDomainMode(): boolean {
    return this.launchType.isDomainMode();
  }

  private filterUniqueHosts(): string[] {
    return this.serverGroup.members
      .map((server) => server.host)
      .filter((item, post, array) => array.indexOf(item) === post);
  }

  private fetchServerStatuses(): void {
    this.serverGroupService.getServerStatuses(this.serverGroup).then((statusMap) => this.serverStatusMap = statusMap);
  }

  private fetchSGCoordinator(): void {
    this.jGroupsService.getServerGroupCoordinator(this.serverGroup).then((coordinator) => this.coordinator = coordinator);
  }

  private fetchInetAddresses(): void {
    this.serverGroupService.getServerInetAddresses(this.serverGroup).then((inetMap) => this.serverInetMap = inetMap);
  }
}
