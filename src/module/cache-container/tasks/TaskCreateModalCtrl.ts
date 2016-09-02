import {ITaskExecutor} from "../../../services/container-tasks/ITaskExecutor";
import {IServerAddress} from "../../../services/server/IServerAddress";
import {ContainerTasksService} from "../../../services/container-tasks/ContainerTasksService";
import {ITaskDefinition} from "../../../services/container-tasks/ITaskDefinition";
import {ICache} from "../../../services/cache/ICache";
import {ICacheContainer} from "../../../services/container/ICacheContainer";
import {IMap} from "../../../common/utils/IMap";
import {isNotNullOrUndefined, isNonEmptyString} from "../../../common/utils/Utils";
export class TaskCreateModalCtrl {

  static $inject: string[] = ["containerTasksService", "container", "availableTasks", "caches", "servers"];

  task: ITaskExecutor = <ITaskExecutor>{};
  errorExecuting: boolean = false;
  errorDescription: string = "";
  successfulOperation: boolean = false;
  taskOutput: string = "";
  displayOutput: boolean = false;
  parameters: {name: string, value: string}[] = [];

  constructor(private containerTasksService: ContainerTasksService,
              private container: ICacheContainer,
              public availableTasks: ITaskDefinition[],
              public caches: ICache[],
              public servers: IServerAddress[]) {
    this.task = {
      name: "",
      cache: "",
      container: container,
      originator: undefined,
      async: false,
      parameters: {}
    };
    for (let i: number = 0; i < 5; i++) {
      this.parameters.push({name: "", value: ""});
    }
  }

  submitTask(): void {
    this.task.parameters = this.createParamMap();
    this.containerTasksService.executeTask(this.task)
      .then(taskOutput => {
          this.successfulOperation = true;
          this.taskOutput = taskOutput;
        },
        error => {
          this.errorExecuting = true;
          this.errorDescription = error;
        });
  }

  private createParamMap(): IMap<string> {
    let paramMap: IMap<string> = {};
    this.parameters
      .filter(param => isNotNullOrUndefined(param) && isNonEmptyString(param.name) && isNonEmptyString(param.value))
      .forEach(param => paramMap[param.name] = param.value);
    return paramMap;
  }
}
