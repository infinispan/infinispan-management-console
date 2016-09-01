import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {JGroupsService} from "../jgroups/JGroupsService";
import {IServerAddress} from "../server/IServerAddress";
import IQService = angular.IQService;
import {ICacheContainer} from "../container/ICacheContainer";
import {ITaskStatus} from "./ITaskStatus";
import {ITaskDefinition} from "./ITaskDefinition";
import {parseServerAddress} from "../../common/utils/Utils";

const module: ng.IModule = App.module("managementConsole.services.container-tasks", []);

export class ContainerTasksService {

  static $inject: string[] = ["$q", "dmrService", "jGroupsService"];

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
              private jGroupsService: JGroupsService) {
  }

  getRunningTasks(container: ICacheContainer): ng.IPromise<ITaskStatus[]> {
    let deferred: ng.IDeferred<ITaskStatus[]> = this.$q.defer<ITaskStatus[]>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
      .then(coordinator => {
          return this.dmrService.executePost({
            operation: "task-status",
            address: this.getContainerAddress(container, coordinator)
          });
        },
        error => deferred.reject(error))
      .then(response => {
        let tasks: ITaskStatus[] = response.map(status => ContainerTasksService.parseTaskStatus(status));
        deferred.resolve(tasks);
      });
    return deferred.promise;
  }

  getTaskDefinitions(container: ICacheContainer): ng.IPromise<ITaskStatus[]> {
    let deferred: ng.IDeferred<ITaskStatus[]> = this.$q.defer<ITaskStatus[]>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
      .then(coordinator => {
          return this.dmrService.executePost({
            operation: "task-list",
            address: this.getContainerAddress(container, coordinator)
          });
        },
        error => deferred.reject(error))
      .then(response => {
        let tasks: ITaskStatus[] = response.map(task => ContainerTasksService.parseTaskDefinition(task));
        deferred.resolve(tasks);
      });
    return deferred.promise;
  }

  private getContainerAddress(container: ICacheContainer, coordinator: IServerAddress): string[] {
    return [].concat("host", coordinator.host, "server", coordinator.name, "subsystem", "datagrid-infinispan",
      "cache-container", container.name);
  }
}

module.service("containerTasksService", ContainerTasksService);
