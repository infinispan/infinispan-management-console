import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {ICache} from "./ICache";

const module: ng.IModule = App.module("managementConsole.services.cache", []);

export class CacheService {
  static $inject: string[] = ["dmrService"];

  constructor(private dmrService: DmrService) {
  }

  getAllCaches(): ICache[] {
    return [];
  }

  getAllCachesByType(): ICache[] {
    return [];
  }

  getCache(): ICache {
    return null;
  }

  createCacheFromTemplate(name: string, type: string, profile: string, container: string): void {
  }
}

module.service("cacheService", CacheService);
