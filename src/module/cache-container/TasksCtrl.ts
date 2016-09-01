import {ICacheContainer} from "../../services/container/ICacheContainer";
import {IClusterEvent} from "../../services/cluster-events/IClusterEvent";
import {ClusterEventsService} from "../../services/cluster-events/ClusterEventsService";
import IModalService = angular.ui.bootstrap.IModalService;
import {IRootScopeService} from "../../common/IRootScopeService";
import {openInfoModal} from "../../common/dialogs/Modals";

export class TasksCtrl {
  static $inject: string[] = ["$rootScope", "$uibModal", "clusterEventsService", "container"];

  history: IClusterEvent[] = [];

  constructor(private $rootScope: IRootScopeService,
              private $uibModal: IModalService,
              private clusterEventsService: ClusterEventsService,
              public container: ICacheContainer) {
    this.getTaskHistory();
  }

  test(): void {
    openInfoModal(this.$uibModal, "Test", "Info");
  }

  displayTaskDetails(task: IClusterEvent): void {
  }

  private getTaskHistory(): void {
    this.clusterEventsService.fetchClusterEvents(this.container, 10, "TASKS")
      .then(events => this.history = this.history.concat(events));
  }
}
