import {App} from "../../ManagementConsole";

const module: ng.IModule = App.module("managementConsole.auth", []);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("logout", {
    url: "logout",
    resolve: {
      logout: ["authService", (authService) => authService.logout()]
    }
  });
});
