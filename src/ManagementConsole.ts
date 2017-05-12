/// <reference path="../typings/globals/jquery/index.d.ts" />
/// <reference path="../typings/globals/angular/index.d.ts" />
/// <reference path="../typings/globals/angular-ui-router/index.d.ts" />
/// <reference path="../typings/globals/toastr/index.d.ts" />
/// <reference path="../typings/globals/angular-translate/index.d.ts" />
/// <reference path="../typings/globals/angular-local-storage/index.d.ts" />
/// <reference path="../typings/globals/angular-ui-bootstrap/index.d.ts" />

/* tslint:disable:variable-name */

import * as angular from "angular";
import "jquery";
import "angular-local-storage";
import "angular-ui-bootstrap";
import "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js";
import "angular-ui-router";
import "c3/c3.js";
import "d3/d3.js";
import "patternfly/dist/js/patternfly.js";
import "angular-translate";
import "angular-translate-loader-static-files";
import "bootstrap";
import "angular-sanitize";
import "angular-drag-and-drop-lists";
import "angular-patternfly";
import "angular-patternfly/styles/angular-patternfly.css!";
import "patternfly/dist/css/patternfly.css!";
import "patternfly/dist/css/patternfly-additions.css!";
import "./ManagementConsole.css!";
import {IUrlRouterService, IStateService} from "angular-ui-router";
import {IPage} from "./common/IPage";
import {IRootScopeService} from "./common/IRootScopeService";
import {NavbarCtrl} from "./module/navbar/NavbarCtrl";
import ITranslateProvider = angular.translate.ITranslateProvider;
import ITemplateCacheService = angular.ITemplateCacheService;
import IAngularEvent = angular.IAngularEvent;
import {VertilizeContainerDirective} from "./components/directives/VertilizeContainerDirective";
import {VertilizeDirective} from "./components/directives/VertilizeDirective";
import {openErrorModal} from "./common/dialogs/Modals";
import IModalService = angular.ui.bootstrap.IModalService;
import IAugmentedJQuery = angular.IAugmentedJQuery;
import {LaunchTypeService} from "./services/launchtype/LaunchTypeService";
import {IdGeneratorDirective} from "./components/directives/IdGeneratorDirective";

const App: ng.IAngularStatic = angular;

const module: ng.IModule = angular.module("managementConsole", [
  "ui.router",
  "ui.bootstrap",
  "pascalprecht.translate",
  "ngSanitize",
  "dndLists",
  "patternfly",
  "patternfly.charts"
]);

// @ngInject
module.config(($translateProvider: ITranslateProvider) => {
  $translateProvider.useStaticFilesLoader({
    prefix: "assets/languages/locale-",
    suffix: ".txt"
  });
  $translateProvider.preferredLanguage("enUS");
});

// @ngInject
module.directive("fileModel", () => {
  return {
    scope: {
      fileModel: "="
    },
    link: (scope: any, element: IAugmentedJQuery): void => {
      element.bind("change", (changeEvent: any) => {
        scope.$apply(() => {
          scope.fileModel = changeEvent.target.files[0];
        });
      });
    }
  };
});

module.directive("vertilizeContainer", VertilizeContainerDirective.factory());
module.directive("vertilize", VertilizeDirective.factory());
module.directive("idGenerator", IdGeneratorDirective.factory());

// @ngInject
module.config(($urlRouterProvider: ng.ui.IUrlRouterProvider) => {
  $urlRouterProvider
    .when("/", "/containers")
    .when("", "/")
    .otherwise("/404");
});

// @ngInject
module.config(($urlMatcherFactoryProvider: ng.ui.IUrlMatcherFactory) => {
  $urlMatcherFactoryProvider.caseInsensitive(true);
  $urlMatcherFactoryProvider.strictMode(false);
});

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("root", {
    url: "/",
    abstract: true,
    views: {
      main: {
        templateUrl: "module/navbar/view/navbar.html",
        controller: NavbarCtrl,
        controllerAs: "ctrl",
      }
    },
    resolve: {
      serverType: ["launchType", (launchType: LaunchTypeService) => launchType.get()],
      user: ["authService", "serverType", (authService, serverType) => authService.login()]
      // Must be called serverType, as launchType is used elsewhere
      // Also we have to rely on "serverType" as this ensures that the launchType is always initialised (except when / is called)
    }
  });

  $stateProvider.state("404", {
    parent: "root",
    url: "404",
    templateUrl: "common/views/error404.html",
  });
});

// @ngInject
module.config(($provide) => {
  // This is necessary to ensure pill navigation tabs are set to the left, with the content to the right
  $provide.decorator("uibTabsetDirective", ($delegate) => {
    $delegate[0].templateUrl = "common/views/configuration-tabset.tpl.html";
    return $delegate;
  });
});

// @ngInject
module.run(($rootScope: IRootScopeService, $timeout: ng.ITimeoutService) => {
  $rootScope.page = <IPage>{htmlClass: ""};
  $rootScope.isDomainControllerAlive = true;
  $rootScope.safeApply = (f: Function) => $timeout(() => this.$apply(f));
});

// @ngInject
module.run(($rootScope: IRootScopeService, $urlRouter: IUrlRouterService, $state: IStateService) => {
  $rootScope.$on("$stateChangeStart", (event: IAngularEvent, toState: any, params: any) => {
    if (toState.redirectTo) {
      event.preventDefault();
      $state.go(toState.redirectTo, params, {location: "replace"});
    }
  });
});

// @ngInject
module.run(($templateCache: ITemplateCacheService) => {
  $templateCache.put("template/tabs/tabset.html",
    "<div>\n" +
    "  <ul class=\"nav nav-{{type || \"tabs\"}} col-md-2\" ng-class=\"{\"nav-stacked\": vertical, \"nav-justified\": justified}\" ng-transclude></ul>\n" +
    "  <div class=\"tab-content col-md-10\">\n" +
    "    <div class=\"tab-pane\" \n" +
    "         ng-repeat=\"tab in tabs\" \n" +
    "         ng-class=\"{active: tab.active}\"\n" +
    "         uib-tab-content-transclude=\"tab\">\n" +
    "    </div>\n" +
    "  </div>\n" +
    "</div>\n");
});

// @ngInject
module.run(($rootScope: IRootScopeService, $uibModal: IModalService, $state: IStateService) => {
  $rootScope.$on("$stateChangeError", (event: IAngularEvent, toState: any, toParams: any, fromState: any, fromParams: any, error: any) => {
    openErrorModal($uibModal, error).result.then(() => {
      $state.go("containers", null, {reload: true});
    });
  });
});

export {App};
