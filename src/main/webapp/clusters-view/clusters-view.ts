import {App} from "../App";
import {Constants} from "../constants";

const module: ng.IModule = App.module("managementConsole.clusters-view", ["ui.router"]);
// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state('clustersView', {
    url: '/clusters',
    views: {
      application: {
        templateUrl: Constants.SRC_DIR + "/clusters-view/clusters-view.html",
        controller: 'ClustersViewCtrl'
      }
    }
  });
});
