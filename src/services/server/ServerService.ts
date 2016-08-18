import {App} from "../../ManagementConsole";
import {ICredentials} from "services/authentication/ICredentials";
import {DmrService} from "../dmr/DmrService";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import ILocalStorageService = angular.local.storage.ILocalStorageService;

const module: ng.IModule = App.module("managementConsole.services.server", []);

export class ServerService {

  static $inject: string[] = ["$interval", "dmrService", "launchType"];

  private alive: boolean = true;

  constructor(private $interval: ng.IIntervalService,
              private dmrService: DmrService,
              private launchType: LaunchTypeService) {
    this.$interval(this.checkServerIsAlive.bind(this), 5000)
  }

  isManagementApiAccessible(): boolean {
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

module.service("serverService", ServerService);
