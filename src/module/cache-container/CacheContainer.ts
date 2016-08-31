import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {CacheContainerCtrl} from "./CacheContainerCtrl";
import {cacheTraitFilter} from "./filters/CacheTraitFilter";
import {cacheStatusFilter} from "./filters/CacheStatusFilter";
import {cacheTypeFilter} from "./filters/CacheTypeFilter";
import {CachesCtrl} from "./CachesCtrl";
import {TasksCtrl} from "./TasksCtrl";

const module: ng.IModule = App.module("managementConsole.cache-container", []);

module.controller("CacheContainerCtrl", CacheContainerCtrl);
module.filter("cacheTraitFilter", cacheTraitFilter);
module.filter("cacheTypeFilter", cacheTypeFilter);
module.filter("cacheStatusFilter", cacheStatusFilter);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("container", {
    parent: "root",
    url: "containers/:profileName/:containerName",
    templateUrl: "module/cache-container/view/cache-container.html",
    controller: CacheContainerCtrl,
    controllerAs: "ctrl",
    resolve: {
      container: ["$stateParams", "containerService", ($stateParams, containerService) => {
        return containerService.getContainer($stateParams.containerName, $stateParams.profileName);
      }]
    }
  });

  $stateProvider.state("container.caches", {
    url: "/caches",
    templateUrl: "module/cache-container/view/caches.html",
    controller: CachesCtrl,
    controllerAs: "cachesCtrl",
    resolve: {
      caches: ["$stateParams", "cacheService", ($stateParams, cacheService) => {
        return cacheService.getAllCachesInContainer($stateParams.containerName, $stateParams.profileName);
      }]
    }
  });

  $stateProvider.state("container.tasks", {
    url: "/tasks",
    templateUrl: "module/cache-container/view/tasks.html",
    controller: TasksCtrl,
    controllerAs: "tasksCtrl"
  });

  $stateProvider.state("container.tasks.running", {
    url: "/running",
    templateUrl: "module/cache-container/view/tasks-running.html",
  });

  $stateProvider.state("container.tasks.history", {
    url: "/history",
    templateUrl: "module/cache-container/view/tasks-history.html",
  });
});
