import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {JGroupsService} from "../jgroups/JGroupsService";
import {IServerAddress} from "../server/IServerAddress";
import {ICacheContainer} from "../container/ICacheContainer";
import {ITaskStatus} from "./ITaskStatus";
import {ITaskDefinition} from "./ITaskDefinition";
import {parseServerAddress, isNullOrUndefined, isEmptyObject} from "../../common/utils/Utils";
import {ITaskExecutor} from "./ITaskExecutor";
import IQService = angular.IQService;
import {LaunchTypeService} from "../launchtype/LaunchTypeService";

const module: ng.IModule = App.module("managementConsole.services.container-tasks", []);

export class ContainerTasksService {

  static $inject: string[] = ["$q", "dmrService", "jGroupsService", "launchType"];

  static parseTaskDefinition(object: any): ITaskDefinition {
    return {
      name: object.name,
      type: object.type,
      mode: object.mode,
      parameters: object.parameters
    };
  }

  static parseTaskStatus(object: any): ITaskStatus {
    return {
      name: object.name,
      start: object.start,
      where: parseServerAddress(object.where) // Parse
    };
  }

  constructor(private $q: IQService,
              private dmrService: DmrService,
              private jGroupsService: JGroupsService,
              private launchType: LaunchTypeService) {
  }

  getRunningTasks(container: ICacheContainer): ng.IPromise<ITaskStatus[]> {
    let deferred: ng.IDeferred<ITaskStatus[]> = this.$q.defer<ITaskStatus[]>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
      .then(coordinator => {
          return this.dmrService.executePost({
            operation: "task-status",
            address: this.getContainerAddress(container.name, coordinator)
          });
        },
        error => deferred.reject(error))
      .then(response => {
        let tasks: ITaskStatus[] = response.map(status => ContainerTasksService.parseTaskStatus(status));
        deferred.resolve(tasks);
      });
    return deferred.promise;
  }

  getTaskDefinitions(container: ICacheContainer): ng.IPromise<ITaskDefinition[]> {
    let deferred: ng.IDeferred<ITaskDefinition[]> = this.$q.defer<ITaskDefinition[]>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
      .then(coordinator => {
          return this.dmrService.executePost({
            operation: "task-list",
            address: this.getContainerAddress(container.name, coordinator)
          });
        },
        error => deferred.reject(error))
      .then(response => {
        let tasks: ITaskDefinition[] = response.map(task => ContainerTasksService.parseTaskDefinition(task));
        deferred.resolve(tasks);
      });
    return deferred.promise;
  }

  executeTask(task: ITaskExecutor): ng.IPromise<string> {
    let deferred: ng.IDeferred<string> = this.$q.defer<string>();
    // If no originator set, then use the containers coordinator
    if (isNullOrUndefined(task.originator) || isEmptyObject(task.originator)) {
      this.jGroupsService.getServerGroupCoordinator(task.container.serverGroup)
        .then(coordinator => {
            task.originator = coordinator;
            return this.executeTaskInternal(task);
          },
          error => deferred.reject(error))
        .then(response => deferred.resolve(response),
          error => deferred.reject(error));
      return deferred.promise;
    }
    // Otherwise execute with provided server
    return this.executeTaskInternal(task);
  }

  private executeTaskInternal(task: ITaskExecutor): ng.IPromise<string> {
    return this.dmrService.executePost({
      operation: "task-execute",
      address: this.getContainerAddress(task.container.name, task.originator),
      name: task.name,
      "cache-name": task.cache,
      async: task.async,
      parameters: task.parameters
    });
  }

  private getContainerAddress(container: string, coordinator: IServerAddress): string[] {
    let path: string [] = ["subsystem", "datagrid-infinispan", "cache-container", container];
    return this.launchType.getRuntimePath(coordinator).concat(path);
  }
}

module.service("containerTasksService", ContainerTasksService);
