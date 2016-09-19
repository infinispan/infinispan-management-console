import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {IStateService} from "angular-ui-router";
import IModalService = angular.ui.bootstrap.IModalService;
import IScope = angular.IScope;
import {ContainerConfigService} from "../../../../services/container-config/ContainerConfigService";
import {ScriptModalCtrl} from "./ScriptModalCtrl";
import {ITask} from "../../../../services/task/ITask";
import {openErrorModal} from "../../../../common/dialogs/Modals";

export class TasksCtrl {

  static $inject: string[] = ["$state", "$scope", "$uibModal", "containerConfigService", "container", "availableTasks"];

  constructor(private $state: IStateService,
              private $scope: IScope,
              private $uibModal: IModalService,
              private containerConfigService: ContainerConfigService,
              private container: ICacheContainer,
              private availableTasks: ITask[]) {
  }

  openRemoveModal(script: ITask): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/config/tasks/view/confirmation-modal.html",
      controller: ScriptModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        container: (): ICacheContainer => this.container,
        task: [() => {
          return this.containerConfigService.loadScriptBody(this.container, script).then((response: any) => {
            script.body = response;
            return script;
          });
        }],
        editing: (): boolean => {
          return false;
        },
        parentController: (): TasksCtrl => this
      }
    });
  }

  openCreateScriptModal(): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/config/tasks/view/edit-script-modal.html",
      controller: ScriptModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        container: (): ICacheContainer => this.container,
        task: (): ITask => {
          return <ITask> {};
        },
        editing: (): boolean => {
          return false;
        },
        parentController: (): TasksCtrl => this
      }
    });
  }

  openEditScriptModal(script: ITask): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/config/tasks/view/edit-script-modal.html",
      controller: ScriptModalCtrl,
      controllerAs: "ctrl",
      resolve: {
        container: (): ICacheContainer => this.container,
        task: [() => {
          return this.containerConfigService.loadScriptBody(this.container, script).then((response: any) => {
            script.body = response;
            return script;
          });
        }],
        editing: (): boolean => {
          return true;
        },
        parentController: (): TasksCtrl => this
      }
    });
  }

  openErrorModal(error: string): void {
    openErrorModal(this.$uibModal, error);
  }

  reloadScripts(): void {
    this.containerConfigService.loadScriptTasks(this.container).then((response: ITask[]) => {
      this.availableTasks = response;
    });
  }
}
