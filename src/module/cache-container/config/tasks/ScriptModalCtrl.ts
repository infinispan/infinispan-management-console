import CodeMirror = require("codemirror");
import {EditorConfiguration} from "codemirror";
import {IStateService} from "angular-ui-router";
import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {IDeployPageScope} from "../../../../services/container-config/IDeployPageScope";
import {ITask} from "../../../../services/task/ITask";
import {TasksCtrl} from "./TasksCtrl";
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;

export class ScriptModalCtrl {
  static $inject: string[] = ["$uibModalInstance", "$state", "$scope", "container", "containerConfigService", "task", "editing", "parentController"];

  errorExecuting: boolean = false;
  errorDescription: string = "";
  editor: CodeMirror.Editor;

  constructor(private $uibModalInstance: IModalServiceInstance,
              private $state: IStateService,
              private $scope: IDeployPageScope,
              private container: ICacheContainer,
              private containerConfigService: ContainerConfigService,
              private task: ITask,
              private editing: boolean,
              private parentController: TasksCtrl) {

    // Once modal is rendered, "dress up" modal textarea with CodeMirror editor
    $uibModalInstance.rendered.then(() => {
      let area: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("container-config.tasks.edit.body.text");
      let editorConfig: EditorConfiguration = <EditorConfiguration> {
        lineNumbers: true,
        mode: "javascript"
      };
      this.editor = CodeMirror.fromTextArea(area, editorConfig);
    });
  }

  // Task creation
  createScript(): void {
    let realBody: string = this.buildBody(this.editing);

    if (this.editor.getValue().length === 0) {
      this.errorExecuting = true;
      this.errorDescription = "Can not create empty script!";
    } else {
      this.containerConfigService.deployScript(this.container, this.task, realBody).then((response: any) => {
        this.$uibModalInstance.close(true);
        this.parentController.reloadScripts();
      }).catch((e) => {
          this.parentController.openErrorModal(e.toString());
        }
      );
    }
  };

  removeScript(): void {
    this.containerConfigService.removeScript(this.container, this.task).then((response: any) => {
      this.parentController.reloadScripts();
    }).catch((e) => {
        this.parentController.openErrorModal(e.toString());
      }
    );
  }

  private buildBody(editing: boolean): string {
    let body: string = "// name=" + this.task.name + ", language=" + this.task.language + "\n";
    body += "// mode=" + this.task.mode + "\n";
    if (this.task.parameters && this.task.parameters.length > 0) {
      body += "// parameters=[" + this.task.parameters + "]\n";
    }
    if (this.task.role && this.task.role.length > 0) {
      body += "// role=" + this.task.role + "\n";
    }
    body += "\n";

    if (!editing) {
      body += this.editor.getValue();
    } else {
      body = this.editor.getValue();
    }
    return body;
  }
}
