import {ICacheContainer} from "../../../services/container/ICacheContainer";
import IModalService = angular.ui.bootstrap.IModalService;
import {ICounter} from "../../../services/counters/ICounter";
import {CounterCreateModalCtrl} from "./CounterCreateModalCtrl";
import {CounterService} from "../../../services/counters/CounterService";
import {openConfirmationModal} from "../../../common/dialogs/Modals";
import {IStateService} from "angular-ui-router";
import {StrongCounter} from "../../../services/counters/StrongCounter";
import {isNotNullOrUndefined} from "../../../common/utils/Utils";

export class CountersCtrl {
  static $inject: string[] = ["$state", "$uibModal", "container", "counterService", "counters"];

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private container: ICacheContainer,
              private counterService: CounterService,
              private counters: ICounter []) {
  }

  createCounterModal(): void {
    this.$uibModal.open({
      templateUrl: "module/cache-container/counters/view/counters-create.html",
      controller: CounterCreateModalCtrl,
      controllerAs: "modalCtrl",
      resolve: {
        container: (): ICacheContainer => this.container,
        counterService: (): CounterService => this.counterService
      }
    });
  }

  reset(counter: ICounter): void {
    let message: string = "Reset counter '" + counter.getName() + "'?";
    openConfirmationModal(this.$uibModal, message, "pficon")
      .result
      .then(() => this.counterService.reset(this.container, counter))
      .then(() => this.$state.reload());
  }

  remove(counter: ICounter): void {

    let message: string = "Remove counter '" + counter.getName() + "'?";
    openConfirmationModal(this.$uibModal, message, "pficon pficon-delete")
      .result
      .then(() => this.counterService.remove(this.container, counter))
      .then(() => this.$state.reload());
  }

  getBounds(counter: ICounter): string {
    if (counter instanceof StrongCounter) {
      let strongCounter: StrongCounter = <StrongCounter> counter;
      let lb: number = strongCounter.getLowerBound();
      let ub: number = strongCounter.getUpperBound();
      return "[" + (isNotNullOrUndefined(lb) ? lb : "") + "," + (isNotNullOrUndefined(ub) ? ub : "") + "]";
    }
    return "N/A";
  }
}
