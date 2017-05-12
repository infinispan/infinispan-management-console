import {ClusterEventsService} from "../../services/cluster-events/ClusterEventsService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {IClusterEvent} from "../../services/cluster-events/IClusterEvent";
import {IServerGroup} from "../../services/server-group/IServerGroup";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {IServerAddress} from "../../services/server/IServerAddress";
import {IMap} from "../../common/utils/IMap";
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";
import {ModalService} from "../../services/modal/ModalService";
import {
  SERVER_STATE_STOPPED,
  SERVER_STATE_RELOAD_REQUIRED,
  SERVER_STATE_RESTART_REQUIRED,
  SERVER_STATE_RUNNING
} from "../../services/server/Server";
import {ServerService} from "../../services/server/ServerService";
import {openErrorModal} from "../../common/dialogs/Modals";
import IModalService = angular.ui.bootstrap.IModalService;

export class ServerGroupsCtrl {
  static $inject: string[] = ["clusterEventsService", "serverGroupService", "containers", "serverGroups",
      "launchType", "modalService", "$state", "serverService", "$uibModal"];

  gridEvents: IClusterEvent[] = [];
  status: IMap<string> = {};

  constructor(private clusterEventsService: ClusterEventsService,
              private serverGroupService: ServerGroupService,
              public containers: ICacheContainer[],
              public serverGroups: IMap<IServerGroup>,
              private launchType: LaunchTypeService,
              private modalService: ModalService,
              private $state: any,
              private serverService: ServerService,
              private $uibModal: IModalService) {
    this.getAllClusterEvents();
    this.getAllSGStatuses();
  }

  getSGHostCount(serverGroup: IServerGroup): number {
    let members: IServerAddress[] = serverGroup.members;
    if (members.length > 1) {
      let hostCount: number = 1;
      let host: string = members[0].host;
      for (let server of members) {
        if (server.host !== host) {
          hostCount++;
          host = server.host;
        }
      }
      return hostCount;
    }
    return members.length;
  }

  getSGServerCount(serverGroup: IServerGroup): number {
    return serverGroup.members.length;
  }

  getSGStatus(serverGroup: IServerGroup): string {
    return this.status[serverGroup.name];
  }

  isInStoppedState(serverGroup: IServerGroup): boolean {
    return this.status[serverGroup.name] === SERVER_STATE_STOPPED;
  }

  isInReloadRequiredState(serverGroup: IServerGroup): boolean {
    return this.status[serverGroup.name] === SERVER_STATE_RELOAD_REQUIRED;
  }

  isInRestartRequiredState(serverGroup: IServerGroup): boolean {
    return this.status[serverGroup.name] === SERVER_STATE_RESTART_REQUIRED;
  }

  isInStartedState(serverGroup: IServerGroup): boolean {
    return this.status[serverGroup.name] === SERVER_STATE_RUNNING;
  }

  isInOtherState(serverGroup: IServerGroup): boolean {
    return !this.isInStartedState(serverGroup) &&
      !this.isInRestartRequiredState(serverGroup) &&
      !this.isInReloadRequiredState(serverGroup);
  }

  openServerConfirmationModal(operation:string, serverGroup: IServerGroup): void {
    this.modalService.openServerConfirmationModal(
      operation,
      serverGroup
    ).then((data) => {
      if (data && data.action === "Finished") {
        this.serverService.refresh().then(() => this.$state.reload());
      }
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

  getMode(): string {
    if (this.launchType.isDomainMode()) {
      return "Domain";
    } else {
      return "Standalone";
    }
  }

  private getAllSGStatuses(): void {
    for (let serverGroup in this.serverGroups) {
      this.setSGStatus(this.serverGroups[serverGroup]);
    }
  }

  private setSGStatus(serverGroup: IServerGroup): void {
    this.serverGroupService.getServerGroupStatus(serverGroup)
      .then((result) => {
        if (result) {
          this.status[serverGroup.name] = result;
        } else {
          this.status[serverGroup.name] = "DEGRADED";
        }
      }, () => {
        this.status[serverGroup.name] = "DEGRADED";
    });
  }

  private getAllClusterEvents(): void {
    for (let container of this.containers) {
      this.clusterEventsService.fetchClusterEvents(container, 10)
        .then((events) => this.gridEvents = this.gridEvents.concat(events));
    }
  }
}
