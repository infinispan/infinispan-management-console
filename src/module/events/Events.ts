import {App} from "../../ManagementConsole";
import "../../services/dmr/DmrService";
import {EventsCtrl} from "./EventsCtrl";

const module: ng.IModule = App.module("managementConsole.events", []);

module.controller("Events", EventsCtrl);

// @ngInject
module.config(($stateProvider: ng.ui.IStateProvider) => {
  $stateProvider.state("events", {
    parent: "root",
    url: "events",
    templateUrl: "module/events/view/events.html",
    controller: EventsCtrl,
    controllerAs: "ctrl",
    resolve: {
      containers: ["containerService", (containerService) => {
        return containerService.getAllContainers();
      }]
    }
  });
});
