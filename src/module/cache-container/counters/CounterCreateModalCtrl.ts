import {ICacheContainer} from "../../../services/container/ICacheContainer";
import {ICounter} from "../../../services/counters/ICounter";
import {
  CounterService, STRONG_COUNTER, COUNTER_TYPES,
  COUNTER_STORAGE_TYPES
} from "../../../services/counters/CounterService";
import {IStateService} from "angular-ui-router";
import {openErrorModal} from "../../../common/dialogs/Modals";
import IModalService = angular.ui.bootstrap.IModalService;
import {StrongCounter} from "../../../services/counters/StrongCounter";
import {WeakCounter} from "../../../services/counters/WeakCounter";
export class CounterCreateModalCtrl {

  static $inject: string[] = ["$state", "$uibModal", "container", "counterService"];

  errorExecuting: boolean = false;
  errorDescription: string = "";
  successfulOperation: boolean = false;
  private name: string;
  private type: string;
  private storage: string;
  private initialValue: number;
  private lowerBound: number;
  private upperBound: number;

  constructor(private $state: IStateService, private $uibModal: IModalService,
              private container: ICacheContainer, private counterService: CounterService) {
  }

  createCounter(): void {
    let counter: ICounter;
    if (this.isNewCounterStrong()) {
      counter = new StrongCounter(this.name, this.storage, this.initialValue, 0, this.lowerBound, this.upperBound);
    } else {
      counter = new WeakCounter(this.name, this.storage, this.initialValue, 0, 32);
    }
    this.counterService.create(counter, this.container.profile, this.container.name).then(
      () => this.$state.reload(), error => openErrorModal(this.$uibModal, error));
  }

  isNewCounterStrong(): boolean {
    return this.type === STRONG_COUNTER;
  }

  getCounterTypes(): string [] {
    return COUNTER_TYPES;
  }

  getStorageTypes(): string [] {
    return COUNTER_STORAGE_TYPES;
  }
}
