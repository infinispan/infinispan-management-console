import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {CacheContainerCtrl} from "./CacheContainerCtrl";
import {cacheTraitFilter} from "./caches/filters/CacheTraitFilter";
import {cacheStatusFilter} from "./caches/filters/CacheStatusFilter";
import {cacheTypeFilter} from "./caches/filters/CacheTypeFilter";
import {CachesCtrl} from "./caches/CachesCtrl";
import {TasksCtrl} from "./tasks/TasksCtrl";
import {IRedirectState} from "../../common/IRedirectState";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {ContainerService} from "../../services/container/ContainerService";
import {IStateParamsService} from "angular-ui-router";

const module: ng.IModule = App.module("managementConsole.cache-container", []);

module.controller("CacheContainerCtrl", CacheContainerCtrl);
module.filter("cacheTraitFilter", cacheTraitFilter);
module.filter("cacheTypeFilter", cacheTypeFilter);
module.filter("cacheStatusFilter", cacheStatusFilter);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("container", <IRedirectState>{
    parent: "root",
    url: "containers/:profileName/:containerName",
    templateUrl: "module/cache-container/view/cache-container.html",
    controller: CacheContainerCtrl,
    controllerAs: "ctrl",
    redirectTo: "container.caches",
    resolve: {
      container: ["$stateParams", "containerService", ($stateParams, containerService) => {
        return containerService.getContainer($stateParams.containerName, $stateParams.profileName);
      }],
      isRebalancingEnabled: ["$stateParams", "containerService", "container",
        ($stateParams: IStateParamsService, containerService: ContainerService, container: ICacheContainer) => {
          return containerService.isRebalancingEnabled(container);
        }
      ]
    }
  });

  $stateProvider.state("container.caches", {
    url: "/caches",
    templateUrl: "module/cache-container/caches/view/caches.html",
    controller: CachesCtrl,
    controllerAs: "$ctrl",
    resolve: {
      caches: ["container", "cacheService", (container, cacheService) => {
        return cacheService.getAllCachesInContainer(container);
      }],
      templates: ["container", "cacheConfigService", (container, cacheConfigService) => {
        return cacheConfigService.getAllContainerTemplatesShallow(container);
      }]
    }
  });

  $stateProvider.state("container.tasks", <IRedirectState>{
    url: "/tasks",
    templateUrl: "module/cache-container/tasks/view/tasks.html",
    controller: TasksCtrl,
    controllerAs: "tasksCtrl",
    redirectTo: "container.tasks.running"
  });

  $stateProvider.state("container.tasks.running", {
    url: "/running",
    templateUrl: "module/cache-container/tasks/view/tasks-running.html",
  });

  $stateProvider.state("container.tasks.history", {
    url: "/history",
    templateUrl: "module/cache-container/tasks/view/tasks-history.html"
  });
});
