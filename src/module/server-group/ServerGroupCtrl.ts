import {UtilsService} from "../../services/utils/UtilsService";
import {IMap} from "../../services/utils/IMap";
import {IServerGroup} from "../../services/server-group/IServerGroup";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {IServerAddress} from "../../services/server/IServerAddress";
import {JGroupsService} from "../../services/jgroups/JGroupsService";
import {IStateService} from "angular-ui-router";
import {AddNodeModalCtrl} from "./AddNodeModalCtrl";
import {ServerService} from "../../services/server/ServerService";
import IModalService = angular.ui.bootstrap.IModalService;
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import {INewServerInstance} from "../../services/server/INewServerInstance";

export class ServerGroupCtrl {
  static $inject: string[] = ["$state", "$uibModal", "serverGroupService", "serverService",
    "jGroupsService", "utils", "serverGroup"];

  available: boolean = false;
  status: string = "DEGRADED";
  serverStatusMap: IMap<string> = {};
  serverInetMap: IMap<string> = {};
  coordinator: IServerAddress;
  hosts: string[];

  constructor(private $state: IStateService, private $uibModal: IModalService,
              private serverGroupService: ServerGroupService, private serverService: ServerService,
              private jGroupsService: JGroupsService, private utils: UtilsService, public serverGroup: IServerGroup) {
    this.fetchSGStatus();
    this.fetchSGCoordinator();
    this.fetchServerStatuses();
    this.fetchInetAddresses();
    this.hosts = this.filterUniqueHosts();
  }

  isCoordinator(server: IServerAddress): boolean {
    return this.coordinator.equals(server);
  }

  isServerStopped(server: IServerAddress): boolean {
    return false;
  }

  getSGStatus(): string {
    return this.status;
  }

  getServerStatus(server: IServerAddress): string {
    if (this.utils.isEmptyObject(this.serverStatusMap)) {
      return "";
    }
    return this.serverStatusMap[server.toString()];
  }

  getServerInetAddress(server: IServerAddress): string {
    if (this.utils.isEmptyObject(this.serverInetMap) || this.utils.isNullOrUndefined(server)) {
      return "";
    }
    return this.serverInetMap[server.toString()];
  }

  refresh(): void {
    this.$state.go("server-group", {
      serverGroup: this.serverGroup.name,
    }, {
      reload: true
    });
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
            return this.serverService.startServer(newServer);
          });
      })
      .finally(() => {
        if (this.utils.isNotNullOrUndefined(bootModal)) {
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

  private filterUniqueHosts(): string[] {
    return this.serverGroup.members
      .map((server) => server.host)
      .filter((item, post, array) => array.indexOf(item) === post);
  }

  private fetchServerStatuses(): void {
    this.serverGroupService.getServerStatuses(this.serverGroup).then((statusMap) => this.serverStatusMap = statusMap);
  }

  private fetchSGStatus(): void {
    this.serverGroupService.areAllServerViewsTheSame(this.serverGroup).then((result) => {
      this.available = result;
      this.status = result ? "STARTED" : "DEGRADED";
    });
  }

  private fetchSGCoordinator(): void {
    this.jGroupsService.getServerGroupCoordinator(this.serverGroup).then((coordinator) => this.coordinator = coordinator);
  }

  private fetchInetAddresses(): void {
    this.serverGroupService.getServerInetAddress(this.serverGroup).then((inetMap) => this.serverInetMap = inetMap);
  }
}
