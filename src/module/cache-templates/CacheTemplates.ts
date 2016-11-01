import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {CacheTemplatesCtrl} from "./CacheTemplatesCtrl";
import {IRedirectState} from "../../common/IRedirectState";
import {isNotNullOrUndefined} from "../../common/utils/Utils";

const module: ng.IModule = App.module("managementConsole.cache-templates", []);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {

  $stateProvider.state("cache-templates", <IRedirectState>{
    parent: "root",
    url: "containers/:profileName/:containerName/config/templates",
    redirectTo: "container-config.templates",
  });

  // We have to repeat parent, controller etc as we are using the same controller. For some reason using the same
  // controller and child views does not work well together
  $stateProvider.state("edit-cache-template", {
    parent: "root",
    url: "containers/:profileName/:containerName/config/templates/:templateType/:templateName",
    controller: CacheTemplatesCtrl,
    controllerAs: "ctrl",
    templateUrl: "module/cache-templates/view/cache-templates.html",
    resolve: {
      container: ["$stateParams", "containerService", ($stateParams, containerService) => {
        return containerService.getContainer($stateParams.containerName, $stateParams.profileName);
      }],
      template: ["$stateParams", "container", "cacheConfigService", ($stateParams, container, cacheConfigService) => {
        return cacheConfigService.getTemplateShallow(container, $stateParams.templateType, $stateParams.templateName);
      }],
      meta: ["$stateParams", "container", "cacheConfigService", ($stateParams, container, cacheConfigService) => {
        return cacheConfigService.getConfigurationMeta(container, $stateParams.templateType);
      }]
    }
  });

  $stateProvider.state("new-cache-template", {
    parent: "root",
    url: "containers/:profileName/:containerName/config/templates/new?templateName&baseType&baseName",
    controller: CacheTemplatesCtrl,
    controllerAs: "ctrl",
    templateUrl: "module/cache-templates/view/cache-templates.html",
    resolve: {
      container: ["$stateParams", "containerService", ($stateParams, containerService) => {
        return containerService.getContainer($stateParams.containerName, $stateParams.profileName);
      }],
      template: ["$q", "$stateParams", "container", "cacheConfigService",
        ($q: ng.IQService, $stateParams, container, cacheConfigService) => {
          let deferred: ng.IDeferred<any> = $q.defer<any>();
          if (isNotNullOrUndefined($stateParams.baseType) && isNotNullOrUndefined($stateParams.baseName)) {
            cacheConfigService.getTemplate(container, $stateParams.baseType, $stateParams.baseName).then(template => {
              template.name = $stateParams.templateName;
              template["template-name"] = $stateParams.templateName;
              deferred.resolve(template);
            });
          } else {
            deferred.resolve({
              name: $stateParams.name,
              type: "distributed-cache",
              mode: "SYNC",
              "template-name": $stateParams.templateName
            });
          }
          return deferred.promise;
        }],
      meta: ["container", "template", "cacheConfigService", (container, template, cacheConfigService) => {
        return cacheConfigService.getConfigurationMeta(container, template.type);
      }]
    }
  });
});
