
export class AddEndpointModalCtrl{
  static $inject: string[] = ["serverGroup", "$scope", "$state"];

  public endpointTypes: string[] = ["hotrod", "rest", "websocket", "router", "memcached"];
  public endpointType: string = this.endpointTypes[0];
  public newEndpointName: string;

  constructor(public serverGroup: any,
              public $scope: any,
              public $state: any) {
  }

  public createEndpoint() {
    let params: any = {
      endpointType: this.endpointType + "-connector",
      endpointName: this.newEndpointName,
      serverGroup: this.serverGroup.name
    };
    this.$scope.$close();
    this.$state.go("new-endpoint-config", params);
  }
}
