/// <reference path="../typings/main/ambient/jquery/index.d.ts" />
/// <reference path="../typings/main/ambient/angular/index.d.ts" />
/// <reference path="../typings/main/ambient/angular-ui-router/index.d.ts" />
/// <reference path="../typings/main/ambient/toastr/index.d.ts" />
/// <reference path="../typings/globals/angular-translate/index.d.ts" />
/// <reference path="../typings/globals/angular-local-storage/index.d.ts" />

/* tslint:disable:variable-name */

import * as angular from "angular";
import "jquery";
import "angular-local-storage";
import "angular-ui-bootstrap";
import "angular-ui-bootstrap/ui-bootstrap-tpls.js";
import "angular-ui-router";
import "jquery-match-height";
import "patternfly";
import "angular-translate";
import "angular-translate-loader-static-files";
import "patternfly/dist/css/patternfly.css!";
import "patternfly/dist/css/patternfly-additions.css!";
import "./ManagementConsole.css!";
import {NavbarCtrl} from "./module/navbar/NavbarCtrl";

const App:ng.IAngularStatic = angular;
const module:ng.IModule = angular.module("managementConsole", [
  "ui.router"
]);

// @ngInject
module.config(($stateProvider:ng.ui.IStateProvider) => {
  // Here we defined the default view for nav, all other states should define this as their parent and it will result
  // in the defined views being applied to that state. Views will automatically be overriden if it is redefined in the child
  $stateProvider.state("root", {
    abstract: true,
    views: {
      nav: {
        templateUrl: "module/navbar/view/navbar.html",
        controller: NavbarCtrl,
        controllerAs: "ctrl"
      }
    }
  });
});

// @ngInject
module.config(($urlRouterProvider:ng.ui.IUrlRouterProvider) => {
  $urlRouterProvider
    .when("/", "/login")
    .when("", "/login")
    .otherwise("/error404");
});

export {App};
