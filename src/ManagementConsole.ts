/// <reference path="../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="../typings/main/ambient/angular/index.d.ts" />
/// <reference path="../typings/main/ambient/angular-ui-router/index.d.ts" />
/// <reference path="../typings/main/ambient/toastr/index.d.ts" />
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
import "jquery-match-height";
import "patternfly";
import "angular-translate";
import "angular-translate-loader-static-files";
import "bootstrap";
import "bootstrap/css/bootstrap.css!";
import "patternfly/dist/css/patternfly.css!";
import "patternfly/dist/css/patternfly-additions.css!";
import "./ManagementConsole.css!";
import {NavbarCtrl} from "./module/navbar/NavbarCtrl";
import {AuthenticationService} from "./services/authentication/AuthenticationService";
import {IUrlRouterService, IStateService} from "angular-ui-router";
import {IPage} from "./common/IPage";
import {IRootScopeService} from "./common/IRootScopeService";
import {ErrorModalCtrl} from "./common/dialogs/ErrorModalCtrl";
import {RestartModalCtrl} from "./common/dialogs/RestartModalCtrl";
import {InfoModalCtrl} from "./common/dialogs/InfoModalCtrl";
import ITranslateProvider = angular.translate.ITranslateProvider;
import ITimeoutService = angular.ITimeoutService;
import IModalService = angular.ui.bootstrap.IModalService;
import ITemplateCacheService = angular.ITemplateCacheService;
import IAngularEvent = angular.IAngularEvent;
import IScope = angular.IScope;
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;

const App: ng.IAngularStatic = angular;
const module: ng.IModule = angular.module("managementConsole", [
  "ui.router",
  "ui.bootstrap",
  "pascalprecht.translate"
]);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  // here we defined the default view for nav, all other states should define this as their parent and it will result
  // in the defined views being applied to that state. Views will automatically be overriden if it is redefined in the child
  $stateProvider.state("root", {
    abstract: true,
    views: {
      nav: {
        templateUrl: "/module/navbar/view/navbar.html",
        controller: NavbarCtrl,
        controllerAs: "ctrl"
      }
    }
  });
});

// @ngInject
module.config(($translateProvider: ITranslateProvider) => {
  $translateProvider.useStaticFilesLoader({
    prefix: "assets/languages/locale-",
    suffix: ".txt"
  });
  $translateProvider.preferredLanguage("enUS");
});

// @ngInject
module.config(($urlRouterProvider: ng.ui.IUrlRouterProvider) => {
  $urlRouterProvider
    .when("/", "/login")
    .when("", "/login")
    .otherwise("/error404");
});

// @ngInject
module.run(($rootScope: IRootScopeService, $timeout: ng.ITimeoutService, $uibModal: IModalService) => {
  $rootScope.page = <IPage>{htmlClass: ""};
  $rootScope.isDomainControllerAlive = true;
  $rootScope.safeApply = (f: Function) => $timeout(() => this.$apply(f));

  $rootScope.openErrorModal = (error: string) => {
    $uibModal.open({
      templateUrl: "common/dialogs/views/generic-error.html",
      controller: ErrorModalCtrl,
      controllerAs: "ctrl",
      scope: $rootScope,
      resolve: {
        errorMsg: error
      }
    });
  };

  $rootScope.openErrorModal = () => {
    $uibModal.open({
      templateUrl: "common/dialogs/views/requires-restart.html",
      controller: RestartModalCtrl,
      controllerAs: "ctrl",
      scope: $rootScope
    });
  };

  $rootScope.openErrorModal = (infoText: string, infoTextDetail: string) => {
    $uibModal.open({
      templateUrl: "common/dialogs/views/generic-info.html",
      controller: InfoModalCtrl,
      controllerAs: "ctrl",
      scope: $rootScope,
      resolve: {
        infoText: infoText,
        infoTextDetail: infoTextDetail
      }
    });
  };
});

// @ngInject
module.run(($rootScope: IRootScopeService, $urlRouter: IUrlRouterService, $state: IStateService, authService: AuthenticationService) => {
  $rootScope.$on("$stateChangeStart", (event: IAngularEvent, toState: any) => {
    if (toState.name === "logout") {
      event.preventDefault();
      if (authService.isLoggedIn()) {
        authService.logout();
      }
      $state.go("login");
    } else if (toState.name !== "login" && !authService.isLoggedIn()) {
      event.preventDefault();
      $state.go("login");
    } else if (toState.name === "login" && authService.isLoggedIn()) {
      $state.go("clusters");
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

export {App};
