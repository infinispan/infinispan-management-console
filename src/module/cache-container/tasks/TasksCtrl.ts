import {ICacheContainer} from "../../../services/container/ICacheContainer";
import {IClusterEvent} from "../../../services/cluster-events/IClusterEvent";
import {ClusterEventsService} from "../../../services/cluster-events/ClusterEventsService";
import {IRootScopeService} from "../../../common/IRootScopeService";
import {ContainerTasksService} from "../../../services/container-tasks/ContainerTasksService";
import {ITaskStatus} from "../../../services/container-tasks/ITaskStatus";
import {TaskCreateModalCtrl} from "./TaskCreateModalCtrl";
import IModalService = angular.ui.bootstrap.IModalService;
import {ITaskDefinition} from "../../../services/container-tasks/ITaskDefinition";
import {CacheService} from "../../../services/cache/CacheService";
import {ICache} from "../../../services/cache/ICache";
import {IServerAddress} from "../../../services/server/IServerAddress";

export class TasksCtrl {
  static $inject: string[] = ["$rootScope", "$uibModal", "cacheService", "clusterEventsService", "containerTasksService", "container"];

  history: IClusterEvent[] = [];
  runningTasks: ITaskStatus[] = [];
  taskCount: number = 10;
  taskCountOptions: number [] = [10, 50, 100];

  constructor(private $rootScope: IRootScopeService,
              private $uibModal: IModalService,
              private cacheService: CacheService,
              private clusterEventsService: ClusterEventsService,
              private containerTasksSevice: ContainerTasksService,
              public container: ICacheContainer) {
    this.getRunningTasks();
    this.getTaskHistory();
  }

  createTaskModal(): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/tasks/view/tasks-create.html",
      controller: TaskCreateModalCtrl,
      controllerAs: "modalCtrl",
      resolve: {
        container: (): ICacheContainer => this.container,
        availableTasks: (): ng.IPromise<ITaskDefinition[]> => this.containerTasksSevice.getTaskDefinitions(this.container),
        caches: (): ng.IPromise<ICache[]> => this.cacheService.getAllCachesInContainer(this.container),
        servers: (): IServerAddress[] => this.container.serverGroup.members
      }
    });
  }

  public getShowingTasks(): number {
    return (this.taskCount < this.history.length) ? this.taskCount : this.history.length;
  }

  private getRunningTasks(): void {
    this.containerTasksSevice.getRunningTasks(this.container)
      .then(tasks => this.runningTasks = tasks);
  }

  private getTaskHistory(): void {
    this.clusterEventsService.fetchClusterEvents(this.container, this.taskCount, "TASKS")
      .then(events => this.history = events);
  }
}
