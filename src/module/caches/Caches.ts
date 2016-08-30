import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {CachesCtrl} from "./CachesCtrl";
import {cacheTraitFilter} from "./filters/CacheTraitFilter";
import {cacheStatusFilter} from "./filters/CacheStatusFilter";
import {cacheTypeFilter} from "./filters/CacheTypeFilter";

const module: ng.IModule = App.module("managementConsole.caches", []);

module.controller("CachesCtrl", CachesCtrl);
module.filter("cacheTraitFilter", cacheTraitFilter);
module.filter("cacheTypeFilter", cacheTypeFilter);
module.filter("cacheStatusFilter", cacheStatusFilter);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("caches", {
    url: "/containers/:profileName/:containerName/caches",
    views: {
      application: {
        templateUrl: "module/caches/view/caches.html",
        controller: CachesCtrl,
        controllerAs: "ctrl",
        resolve: {
          container: ["$stateParams", "containerService", ($stateParams, containerService) => {
            return containerService.getContainer($stateParams.containerName, $stateParams.profileName);
          }],
          caches: ["$stateParams", "cacheService", ($stateParams, cacheService) => {
            return cacheService.getAllCachesInContainer($stateParams.containerName, $stateParams.profileName);
          }]
        }
      }
    }
  });
});
