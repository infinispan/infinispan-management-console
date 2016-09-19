import {IStateService} from "angular-ui-router";
import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {IDeployPageScope} from "../../../../services/container-config/IDeployPageScope";
import {ITask} from "../../../../services/task/ITask";
import {TasksCtrl} from "./TasksCtrl";

export class ScriptModalCtrl {
  static $inject: string[] = ["$state", "$scope", "container", "containerConfigService", "task", "editing", "parentController"];

  constructor(private $state: IStateService,
              private $scope: IDeployPageScope,
              private container: ICacheContainer,
              private containerConfigService: ContainerConfigService,
              private task: ITask,
              private editing: boolean,
              private parentController: TasksCtrl) {
  }

  // Task creation
  createScript(): void {
    // In edit mode, we allow the user to edit the script directly
    let realBody: string = this.editing ? this.task.body : this.buildBody();

    this.containerConfigService.deployScript(this.container, this.task, realBody).then((response: any) => {
      this.parentController.reloadScripts();
    }).catch((e) => {
        this.parentController.openErrorModal(e.toString());
      }
    );
  };

  removeScript(): void {
    this.containerConfigService.removeScript(this.container, this.task).then((response: any) => {
      this.parentController.reloadScripts();
    }).catch((e) => {
        this.parentController.openErrorModal(e.toString());
      }
    );
  }

  private buildBody(): string {

    let body: string = "// name=" + this.task.name + ", language=" + this.task.language + "\n";
    body += "// mode=" + this.task.mode + "\n";
    if (this.task.parameters && this.task.parameters.length > 0) {
      body += "// parameters=[" + this.task.parameters + "]\n";
    }
    if (this.task.role && this.task.role.length > 0) {
      body += "// role=" + this.task.role + "\n";
    }

    body += "\n";
    body += this.task.body;

    return body;
  }
}
