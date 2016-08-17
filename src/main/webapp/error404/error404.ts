import {App} from "../App";
import {Constants} from "../constants";

const module:ng.IModule = App.module("managementConsole.error", ["ui.router"]);

module.config(($stateProvider:ng.ui.IStateProvider) => {
  $stateProvider.state("error404", {
    url: "/error404",
    views: {
      application: {
        templateUrl: Constants.SRC_DIR + "/error404/error404.html"
      }
    }
  });
});
