/// <reference path="../../../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="../../../typings/main/ambient/angular/index.d.ts" />
/// <reference path="../../../typings/main/ambient/angular-ui-router/index.d.ts" />
/// <reference path="../../../typings/main/ambient/toastr/index.d.ts" />
/// <reference path="../../../typings/globals/angular-local-storage/index.d.ts" />
/// <reference path="../../../typings/globals/angular-translate/index.d.ts" />

/* tslint:disable:variable-name */

import * as angular from "angular";
import "angular-local-storage";
import "angular-translate";
import "angular-translate-loader-static-files";
import "angular-ui-router";
import "bootstrap";
import "bootstrap/css/bootstrap.css!";

const App:ng.IAngularStatic = angular;
const module:ng.IModule = angular.module("managementConsole", [
  "ui.router",
  "pascalprecht.translate",
  "LocalStorageModule"
]);

// @ngInject
module.config(($urlRouterProvider:ng.ui.IUrlRouterProvider) => {
  $urlRouterProvider
    .when("/", "/login")
    .when("", "/login")
    .otherwise("/error404");
});

// @ngInject
module.config(($translateProvider: ng.translate.ITranslateProvider) => {
  $translateProvider.useStaticFilesLoader({
    prefix: 'assets/languages/locale-',
    suffix: '.txt'
  });
  $translateProvider.preferredLanguage('enUS');
});

// @ngInject
module.config(['localStorageServiceProvider', function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('infinispan-management-console')
    .setStorageType('sessionStorage');
}]);

module.constant('CONSTANTS', {
  'NO_BASE_CONFIGURATION_TEMPLATE': '<none>'
});

// TODO add other main things from management-console.ts here and then rename App.ts to ManagementConsole.ts

export {App};
