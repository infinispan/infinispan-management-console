import {App} from "../App";
import {Constants} from "../constants";
import "./login.controller";

const module:ng.IModule = App.module("managementConsole.login", ["ui.router"]);

// @ngInject
module.config(($stateProvider:ng.ui.IStateProvider) => {
  $stateProvider.state("login", {
    url: "/login",
    views: {
      application: {
        templateUrl: Constants.SRC_DIR + "/login/login.html",
        controller: 'LoginCtrl'
      }
    }
  });
});
