import {App} from "../../ManagementConsole";

const module:ng.IModule = App.module("managementConsole.services.launchtype", []);

export class LaunchTypeService {

  static $inject: string[] = [];
  static DOMAIN_MODE: string = "DOMAIN";
  static STANDALONE_MODE: string = "STANDALONE";

  constructor(private type: string) {}

  set(launchType: string): void {
    switch (launchType) {
      case LaunchTypeService.DOMAIN_MODE:
        this.type = launchType;
        break;
      case LaunchTypeService.STANDALONE_MODE:
        throw "We only support Domain mode. Standalone mode is not supported in this release!";
      default:
        throw `Unknown launch type '${launchType}'. We only support Domain mode`;
    }
  }

  isDomainMode(): boolean {
    return LaunchTypeService.DOMAIN_MODE === this.type;
  }

  isStandaloneMode(): boolean {
    return LaunchTypeService.STANDALONE_MODE === this.type;
  }

}

module.service("launchType", LaunchTypeService);
