import {App} from "../../ManagementConsole";
import {LoginCtrl} from "./LoginCtrl";

const module: ng.IModule = App.module("managementConsole.auth", []);

module.controller("Login", LoginCtrl);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("login", {
    url: "/login",
    views: {
      application: {
        templateUrl: "module/auth/view/login.html",
        controller: LoginCtrl,
        controllerAs: "ctrl"
      }
    }
  });
});
