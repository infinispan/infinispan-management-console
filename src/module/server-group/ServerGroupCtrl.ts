import {IServerGroup} from "../../services/server-group/IServerGroup";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {IServerAddress} from "../../services/server/IServerAddress";
import {JGroupsService} from "../../services/jgroups/JGroupsService";
import {IStateService} from "angular-ui-router";
import {AddNodeModalCtrl} from "./nodes/AddNodeModalCtrl";
import {ServerService} from "../../services/server/ServerService";
import {DmrService} from "../../services/dmr/DmrService";
import {IMap} from "../../common/utils/IMap";
import {isEmptyObject, isNotNullOrUndefined, isNullOrUndefined} from "../../common/utils/Utils";
import {openErrorModal} from "../../common/dialogs/Modals";
import IModalService = angular.ui.bootstrap.IModalService;
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";
import {BootingModalCtrl} from "./BootingModalCtrl";
import {
  SERVER_STATE_RUNNING, SERVER_STATE_STOPPED, SERVER_STATE_RELOAD_REQUIRED,
  SERVER_STATE_RESTART_REQUIRED
} from "../../services/server/Server";
import {ModalService} from "../../services/modal/ModalService";

export class ServerGroupCtrl {
  static $inject: string[] = ["$state", "$uibModal", "dmrService", "serverGroupService", "serverService",
    "jGroupsService", "launchType", "serverGroup", "available", "status", "$filter", "modalService"];

  serverStatusMap: IMap<string> = {};
  statuses: string [] = [];
  serverInetMap: IMap<string> = {};
  coordinator: IServerAddress;
  hosts: string[];

  filteredMembers: any[];
  searchNameQuery: string;

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private dmrService: DmrService,
              private serverGroupService: ServerGroupService,
              private serverService: ServerService,
              private jGroupsService: JGroupsService,
              private launchType: LaunchTypeService,
              public serverGroup: IServerGroup,
              public available: boolean,
              private status: string,
              private $filter: any,
              private modalService: ModalService) {
    this.fetchSGCoordinator();
    this.fetchServerStatuses();
    this.fetchInetAddresses();
    this.hosts = this.filterUniqueHosts();

    this.filteredMembers = this.search();
  }

  isCoordinator(server: IServerAddress): boolean {
    return (this.coordinator) ? this.coordinator.equals(server) : false;
  }

  isServerRunning(server: IServerAddress): boolean {
    return this.isServerInState(server, SERVER_STATE_RUNNING);
  }

  isAtLeastOneServerInRunningState(): boolean {
    return this.isAtLeastOneServerInServerGroupInState(SERVER_STATE_RUNNING);
  }

  isAtLeastOneServerInReloadRequiredState(): boolean {
    return this.isAtLeastOneServerInServerGroupInState(SERVER_STATE_RELOAD_REQUIRED);
  }

  isAtLeastOneServerInRestartRequiredState(): boolean {
    return this.isAtLeastOneServerInServerGroupInState(SERVER_STATE_RESTART_REQUIRED);
  }

  isAtLeastOneServerInStoppedState(): boolean {
    return this.isAtLeastOneServerInServerGroupInState(SERVER_STATE_STOPPED);
  }

  areAllServersInStoppedState(): boolean {
    return this.areAllServersInServerGroupInState(SERVER_STATE_STOPPED);
  }

  isServerStopped(server: IServerAddress): boolean {
    return this.isServerInState(server, SERVER_STATE_STOPPED);
  }

  isServerInReloadRequired(server: IServerAddress): boolean {
    return this.isServerInState(server, SERVER_STATE_RELOAD_REQUIRED);
  }

  isServerInRestartRequired(server: IServerAddress): boolean {
    return this.isServerInState(server, SERVER_STATE_RESTART_REQUIRED);
  }

  isServerInState(server: IServerAddress, state: string): boolean {
    return this.getServerStatus(server) === state;
  }

  getSGStatus(): string {
    return this.status;
  }

  getServerStatus(server: IServerAddress): string {
    if (isEmptyObject(this.serverStatusMap)) {
      return "";
    }
    let state:string = this.serverStatusMap[server.toString()];
    return state.toUpperCase();
  }

  getServerInetAddress(server: IServerAddress): string {
    if (isEmptyObject(this.serverInetMap) || isNullOrUndefined(server)) {
      return "";
    }
    return this.serverInetMap[server.toString()];
  }

  refresh(): void {
    this.serverService.refresh().then(() => this.$state.reload());
  }

  createServerModal(): void {
    let modal: IModalServiceInstance = this.$uibModal.open({
      templateUrl: "module/server-group/nodes/view/add-node-modal.html",
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
            bootModal = this.createBootingModal("start");
            return this.serverService.startServer(newServer.address);
          }, error => openErrorModal(this.$uibModal, error));
      })
      .finally(() => {
        if (isNotNullOrUndefined(bootModal)) {
          bootModal.close();
        }
        this.refresh();
      });
  }

  createBootingModal(operation: string): IModalServiceInstance {
    return this.$uibModal.open({
      templateUrl: "module/server-group/nodes/view/booting-modal.html",
      controller: BootingModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        operation: (): string => {
          return operation;
        },
        clusterName: (): string => {
          return this.serverGroup.name;
        }
      }
    });
  }

  createStoppingModal(): IModalServiceInstance {
    return this.$uibModal.open({
      templateUrl: "module/server-group/nodes/view/stopping-modal.html"
    });
  }

  openServerConfirmationModal(operation: string): void {
    this.modalService.openServerConfirmationModal(
      operation,
      this.serverGroup
    ).then((data) => {
      if (data.hasOwnProperty("error", data)) {
        return data;
      }

      this.refresh();
    })
    .catch(error => {
      // Prevent opening the Error modal after closing confirm modal
      if (error && error.action !== "Cancelled" && error.error !== "backdrop click") {
        openErrorModal(this.$uibModal, error);
      }
    });
  }

  isDomainMode(): boolean {
    return this.launchType.isDomainMode();
  }

  hasFiltersApplied(): boolean {
    return this.searchNameQuery.length !== 0;
  }

  search(): any {
    if (this.searchNameQuery && !this.hasFiltersApplied()) {
      this.filteredMembers = this.serverGroup.members;
    } else {
      this.filteredMembers = this.$filter("serverFilter")(this.serverGroup.members, this.serverInetMap, this.searchNameQuery);
    }

    return this.filteredMembers;
  }

  clearFilters(): void {
    this.searchNameQuery = "";
    this.filteredMembers = this.search();
  }

  private areAllServersInServerGroupInState(state: string): boolean {
    return this.serverStatuses().every((serverStatus: string) => {
      return serverStatus === state;
    });
  }

  private isAtLeastOneServerInServerGroupInState(state: string): boolean {
    return this.serverStatuses().indexOf(state) > -1;
  }

  private serverStatuses(): string [] {
    return this.statuses;
  }

  private filterUniqueHosts(): string[] {
    return this.serverGroup.members
      .map((server) => server.host)
      .filter((item, post, array) => array.indexOf(item) === post);
  }

  private fetchServerStatuses(): void {
    this.serverGroupService.getServerStatuses(this.serverGroup).then((statusMap) => {
      this.serverStatusMap = statusMap;
      this.statuses = this.serverGroupService.statusMapToArray(statusMap);
    });
  }

  private fetchSGCoordinator(): void {
    this.jGroupsService.getServerGroupCoordinator(this.serverGroup).then((coordinator) => this.coordinator = coordinator);
  }

  private fetchInetAddresses(): void {
    this.serverGroupService.getServerInetAddresses(this.serverGroup).then((inetMap) => this.serverInetMap = inetMap);
  }
}
