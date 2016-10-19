import {App} from "../../ManagementConsole";
import {isNullOrUndefined} from "../../common/utils/Utils";
import ILocalStorageService = angular.local.storage.ILocalStorageService;
import {IServerAddress} from "../server/IServerAddress";

const module: ng.IModule = App.module("managementConsole.services.launchtype", []);

export class LaunchTypeService {

  static $inject: string[] = ["localStorageService"];
  static DOMAIN_MODE: string = "DOMAIN";
  static STANDALONE_MODE: string = "STANDALONE";

  private hasJGroupsSubsystem: boolean = true;

  constructor(private localStorageService: ILocalStorageService,
              private type: string) {
  }

  set(launchType: string, hasJgroupsSubsystem: boolean): void {
    switch (launchType) {
      case LaunchTypeService.DOMAIN_MODE:
        this.type = launchType;
        break;
      case LaunchTypeService.STANDALONE_MODE:
        this.type = launchType;
        this.hasJGroupsSubsystem = hasJgroupsSubsystem;
        break;
      default:
        throw `Unknown launch type '${launchType}'. We only support Domain mode`;
    }
    this.localStorageService.set("launchType", launchType);
  }

  isDomainMode(): boolean {
    this.checkThatLaunchTypeExists();
    return LaunchTypeService.DOMAIN_MODE === this.type;
  }

  isStandaloneMode(): boolean {
    this.checkThatLaunchTypeExists();
    return LaunchTypeService.STANDALONE_MODE === this.type;
  }

  isStandaloneClusteredMode(): boolean {
    return this.isStandaloneMode() && this.hasJGroupsSubsystem;
  }

  isStandaloneLocalMode(): boolean {
    return this.isStandaloneMode() && !this.hasJGroupsSubsystem;
  }

  getProfilePath(profile: string): string [] {
    if (this.isDomainMode()) {
      return [].concat("profile", profile);
    } else if (this.isStandaloneMode()) {
      return [];
    }
  }

  getRuntimePath(server: IServerAddress): string [] {
    if (this.isDomainMode()) {
      return [].concat("host", server.host, "server", server.name);
    } else if (this.isStandaloneMode()) {
      return [];
    }
  }

  private checkThatLaunchTypeExists(): void {
    if (isNullOrUndefined(this.type)) {
      this.type = this.localStorageService.get<string>("launchType");
    }
  }

}

module.service("launchType", LaunchTypeService);
