import {EndpointService} from "../../../services/endpoint/EndpointService";
export class AddEndpointModalCtrl {
  static $inject: string[] = ["serverGroup", "$scope", "$state", "endpointService"];

  public endpointTypes: string[] = this.endpointService.getEndpointTypes();
  public endpointType: string = this.endpointTypes[0];
  public newEndpointName: string;

  constructor(public serverGroup: any,
              public $scope: any,
              public $state: any,
              public endpointService: EndpointService) {
  }

  public createEndpoint(): void {
    let params: any = {
      endpointType: this.endpointType + "-connector",
      endpointName: this.newEndpointName,
      profile: this.serverGroup.profile
    };
    this.$scope.$close();
    this.$state.go("new-endpoint-config", params);
  }
}
