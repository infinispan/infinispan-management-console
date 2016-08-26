import {UtilsService} from "../../services/utils/UtilsService";
import {IMap} from "../../services/utils/IMap";
import {IServerGroup} from "../../services/server-group/IServerGroup";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {IServerAddress} from "../../services/server/IServerAddress";
import {JGroupsService} from "../../services/jgroups/JGroupsService";
import {IStateService} from "angular-ui-router";

export class ServerGroupCtrl {
  static $inject: string[] = ["$state", "serverGroupService", "jGroupsService", "utils", "serverGroup"];

  available: boolean = false;
  status: string = "DEGRADED";
  serverStatusMap: IMap<string> = {};
  serverInetMap: IMap<string> = {};
  coordinator: IServerAddress;

  constructor(private $state: IStateService, private serverGroupService: ServerGroupService,
              private jGroupsService: JGroupsService, private utils: UtilsService,
              public serverGroup: IServerGroup) {
    this.fetchSGStatus();
    this.fetchSGCoordinator();
    this.fetchServerStatuses();
    this.fetchInetAddresses();
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
