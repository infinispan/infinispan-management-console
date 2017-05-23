import {IStateService} from "angular-ui-router";
import IModalService = angular.ui.bootstrap.IModalService;


export class AddEndpointModalCtrl {
  static $inject: string[] = ["$state", "$uibModal"];



  constructor(private $state: IStateService,
              private $uibModal: IModalService) {
  }
}
