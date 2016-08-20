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
import ITranslateProvider = angular.translate.ITranslateProvider;
import IRootScopeService = angular.IRootScopeService;
import ITimeoutService = angular.ITimeoutService;
import IModalService = angular.ui.bootstrap.IModalService;
import ITemplateCacheService = angular.ITemplateCacheService;
import IAngularEvent = angular.IAngularEvent;

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

// TODO convert to typescript!
// @ngInject
module.run(["$rootScope", "$timeout", "$uibModal", "utils", function ($rootScope, $timeout, $uibModal, utils) {
  // isDomainControllerAlive is used for web app to server connectivity checking
  $rootScope.isDomainControllerAlive = true;
  $rootScope.safeApply = function (f) {
    var scope = this;
    $timeout(function () {
      scope.$apply(f);
    });
  };
  $rootScope.page = {htmlClass: ""};

  // generic error modal
  $rootScope.openErrorModal = function (error) {
    $uibModal.open({
      templateUrl: "components/dialogs/generic-error.html",
      controller: function ($scope, $modalInstance) {
        if (typeof error === "string") {
          $scope.errorText = "An error has occurred:";
          $scope.errorTextDetail = error;
        }
        else {
          utils.traverse(error, function (key, value, trail) {
            $scope.errorText = trail[0];
            $scope.errorTextDetail = value;
          });
        }
        $scope.ok = function () {
          $modalInstance.close();
        };
      },
      scope: $rootScope
    });
  };

  // generic info modal
  $rootScope.openRestartModal = function () {
    if ($rootScope.requiresRestartFlag) {
      $uibModal.open({
        templateUrl: "components/dialogs/requires-restart.html",
        controller: function ($scope, $modalInstance, clusterNodesService) {

          $scope.ok = function () {
            clusterNodesService.restartCluster();
            $rootScope.requiresRestartFlag = false;
          };

          $scope.cancel = function () {
            $modalInstance.close();
          }
        },
        scope: $rootScope
      });
    }
  };

  // generic info modal
  $rootScope.openInfoModal = function (infoText, infoTextDetail) {
    $uibModal.open({
      templateUrl: "components/dialogs/generic-info.html",
      controller: function ($scope, $modalInstance) {
        $scope.infoText = infoText;
        $scope.infoTextDetail = infoTextDetail;

        $scope.ok = function () {
          $modalInstance.close();
        };
      },
      scope: $rootScope
    });
  };
}]);

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
