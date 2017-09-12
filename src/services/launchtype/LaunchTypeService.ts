import {App} from "../../ManagementConsole";
import {isNullOrUndefined, isNotNullOrUndefined, MemoryUnits} from "../../common/utils/Utils";
import ILocalStorageService = angular.local.storage.ILocalStorageService;
import {IServerAddress} from "../server/IServerAddress";
import {DmrService} from "../dmr/DmrService";

const module: ng.IModule = App.module("managementConsole.services.launchtype", ["LocalStorageModule"]);

export class LaunchTypeService {

  static $inject: string[] = ["$q", "localStorageService", "dmrService"];
  static DOMAIN_MODE: string = "DOMAIN";
  static STANDALONE_MODE: string = "STANDALONE";

  private hasJGroupsSubsystem: boolean = true;

  constructor(private $q: ng.IQService,
              private localStorageService: ILocalStorageService,
              private dmrService: DmrService,
              private type: string) {
  }

  get(): ng.IPromise<string> {
    let deferred: ng.IDeferred<string> = this.$q.defer();
    this.dmrService.executePost({
      address: [],
      recursive: true,
      "include-runtime": true,
      "operation": "read-resource",
      "recursive-depth": 2
    }, true).then((response: any) => {
      let hasJGroupsStack: boolean = true;
      let launchType: string = response["launch-type"];
      if (LaunchTypeService.STANDALONE_MODE === launchType) {
        hasJGroupsStack = isNotNullOrUndefined(response.subsystem["datagrid-jgroups"]);
      }
      this.set(launchType, hasJGroupsStack);
      deferred.resolve(this.type);
    }, error => deferred.reject(error));
    return deferred.promise;
  }

  isLaunchTypeInitialised(): boolean {
    return isNotNullOrUndefined(this.type);
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

  getMemoryUnit(): MemoryUnits {
    return MemoryUnits.MB;
  }

  private set(launchType: string, hasJgroupsSubsystem: boolean): void {
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
    this.localStorageService.set("hasJgroupsSubsystem", hasJgroupsSubsystem);
  }

  private checkThatLaunchTypeExists(): void {
    if (isNullOrUndefined(this.type)) {
      this.type = this.localStorageService.get<string>("launchType");
      this.hasJGroupsSubsystem = this.localStorageService.get<boolean>("hasJgroupsSubsystem");
    }
  }
}

module.service("launchType", LaunchTypeService);
