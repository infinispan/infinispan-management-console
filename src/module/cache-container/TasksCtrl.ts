import {ICacheContainer} from "../../services/container/ICacheContainer";
import {IClusterEvent} from "../../services/cluster-events/IClusterEvent";
import {ClusterEventsService} from "../../services/cluster-events/ClusterEventsService";
import {IRootScopeService} from "../../common/IRootScopeService";
import IModalService = angular.ui.bootstrap.IModalService;
import {ContainerTasksService} from "../../services/container-tasks/ContainerTasksService";
import {ITaskStatus} from "../../services/container-tasks/ITaskStatus";

export class TasksCtrl {
  static $inject: string[] = ["$rootScope", "$uibModal", "clusterEventsService", "containerTasksService", "container"];

  history: IClusterEvent[] = [];
  runningTasks: ITaskStatus[] = [];

  constructor(private $rootScope: IRootScopeService,
              private $uibModal: IModalService,
              private clusterEventsService: ClusterEventsService,
              private containerTasksSevice: ContainerTasksService,
              public container: ICacheContainer) {
    this.getTaskHistory();
    this.getRunningTasks();
  }

  private getRunningTasks(): void {
    this.containerTasksSevice.getRunningTasks(this.container)
      .then(tasks => this.runningTasks = tasks);
  }

  private getTaskHistory(): void {
    this.clusterEventsService.fetchClusterEvents(this.container, 10, "TASKS")
      .then(events => this.history = this.history.concat(events));
  }
}
