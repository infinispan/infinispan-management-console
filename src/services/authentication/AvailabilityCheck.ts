import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";

const module: ng.IModule = App.module("managementConsole.services.authentication");

export class AvailabilityCheck {

  static $inject: string[] = ["$interval", "dmrService", "$q", "$window", "$timeout"];
  static currentServerLaunchType: string;

  private alive: boolean = true;
  private serverCheck: ng.IPromise<any>;

  constructor(private $interval: ng.IIntervalService,
              private dmrService: DmrService,
              private $q: ng.IQService,
              private $window: ng.IWindowService,
              private $timeout: ng.ITimeoutService) {
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

  public checkServerIsAlive(): void {
    this.dmrService.readAttribute({address: [], name: "launch-type"})
      .then((response) => {
        if (!response) {
          return undefined;
        }

        if (!AvailabilityCheck.currentServerLaunchType) {
          AvailabilityCheck.currentServerLaunchType = response;
        } else if (AvailabilityCheck.currentServerLaunchType !== response) {
          // The only way to wait for domain mode server to load and not make the app respond to a false positive
          this.$timeout((): void => {
            this.$window.location.reload(true);
          }, 10000);
        }
        this.alive = true;
      })
      .catch(() => this.alive = false);
  }
}

module.service("availabilityCheck", AvailabilityCheck);
