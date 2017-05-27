import {EndpointService} from './../../../services/endpoint/EndpointService';
import {ServerGroupService} from './../../../services/server-group/ServerGroupService';
import {openConfirmationModal, openErrorModal, openRestartModal} from "./../../../common/dialogs/Modals";
import {IEndpoint} from "../../../services/endpoint/IEndpoint";
import {LaunchTypeService} from "../../../services/launchtype/LaunchTypeService";
import IModalService = angular.ui.bootstrap.IModalService;



export class EndpointModalCtrl {
  static $inject: string[] = ["endpointType", "serverGroup", "endpointService", "serverGroupService",  "$scope", "$uibModal", "$state", "launchType"];

  public endpoint: IEndpoint;
  public endpointTypes: string[];
  public endpointMeta: any;

  public newEndpointName: string;
  public hasEndpointData: boolean = undefined;
  
  public tabs: string[] = ['type', 'configuration'];
  public selectedTab: string = this.tabs[0];

  constructor(public endpointType: string,
              public serverGroup: any,
              public endpointService: EndpointService,
              private serverGroupService: ServerGroupService,
              public $scope: any,
              private $uibModal: IModalService,
              public $state: any,
              public launchType: LaunchTypeService) {
    this.endpointMeta = undefined;

    this.endpointService
    .getConfigurationMeta('clustered', 'datagrid-infinispan-endpoint', '')
    .then(meta => {
      this.endpointTypes = Object.keys(meta.children).map(child => child);
      this.endpointType = this.endpointTypes[0];
    });
    this.$scope.$watch(() => this.endpointType && this.newEndpointName !== '', (newVal) => this.hasEndpointData = newVal);
  }

  goToEndpointsView(): void {
    this.$state.go("server-group.endpoints", {serverGroup: this.serverGroup.name});
  }

  create(endpoint: IEndpoint): ng.IPromise<any> {
    let excludedAttributes: string [] = ["is-new-node"];
    return this.endpointService.save(endpoint, excludedAttributes);
  }

  public modalAction() {
    if (!this.endpointMeta && this.hasEndpointData && this.selectedTab === this.tabs[0]) {
      this.endpointService.getConfigurationMeta(this.serverGroup.profile,  this.endpointType, this.endpointType)
      .then(data => {
        if (data && data.hasOwnProperty('description') && data.hasOwnProperty('children')) {
          this.endpointMeta = data;
          this.selectedTab = this.tabs[1];

          this.endpoint = EndpointService.parseEndpoint([].concat(this.endpointType).concat(this.newEndpointName), {});
        }
      });
    } else if (this.endpointMeta && this.selectedTab === this.tabs[1]) {
      openConfirmationModal(this.$uibModal, "Create endpoint " + this.newEndpointName + "?").result.then(() => {
        this.create(this.endpoint)
          .then(() => {
              if (this.launchType.isStandaloneMode()) {
                openConfirmationModal(this.$uibModal,
                  "Config changes will only be made available after you manually restart the server!").result.then(() => {
                  this.goToEndpointsView();
                }, () => {
                  this.goToEndpointsView();
                });
              } else {
                openRestartModal(this.$uibModal).result.then(() => {
                  this.serverGroupService.restartServers(this.serverGroup).then(() => this.goToEndpointsView());
                }, () => {
                  this.goToEndpointsView();
                });
              }
              // this.cleanMetaData();
            },
            error => openErrorModal(this.$uibModal, error));
      });
      this.$scope.$close();
    }
    // !ctrl.hasEndpointData && ctrl.createEndpoint();$close() ||
  }

  //         endpoint: ["$stateParams", "endpointService", "serverGroup", ($stateParams, endpointService, serverGroup) => {
        // return EndpointService.parseEndpoint([].concat($stateParams.endpointType).concat($stateParams.endpointName), {});
        // }],
        // endpointMeta: ["$stateParams", "endpointService", "serverGroup", ($stateParams, endpointService, serverGroup) => {
        //   return endpointService.getConfigurationMeta(serverGroup.profile,  $stateParams.endpointType,  $stateParams.endpointType);
        // }],
        // endpointName: ["$stateParams", ($stateParams) => $stateParams.endpointName],
        // endpointType: ["$stateParams", ($stateParams) => $stateParams.endpointType]
}
