import {DmrService} from "../dmr/DmrService";

export class AvailabilityCheck {

  private alive: boolean = true;
  private serverCheck: ng.IPromise<any>;

  constructor(private $interval: ng.IIntervalService,
              private dmrService: DmrService) {
  }

  startApiAccessibleCheck(): void {
    this.serverCheck = this.$interval(this.checkServerIsAlive.bind(this), 5000);
  }

  stopApiAccessibleCheck(): void {
    this.$interval.cancel(this.serverCheck);
  }

  isApiAccesible(): boolean {
    return this.alive;
  }

  private checkServerIsAlive(): void {
    this.dmrService.readAttribute({address: [], name: "launch-type"})
      .then(() => {
        this.alive = true;
      })
      .catch(() => {
        this.alive = false;
      });
  }
}
