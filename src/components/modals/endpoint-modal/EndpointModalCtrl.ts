
export class EndpointModalCtrl {
  static $inject: string[] = ["endpointType", "serverGroup", "$scope", "$state"];

  public endpointTypes: string[];
  public newEndpointName: string;

  constructor(public endpointType: string,
              public serverGroup: any,
              public $scope: any,
              public $state: any) {
    this.endpointTypes = ["hotrod-connector", "websocket-connector", "rest-connector", "router-connector", "memcached-connector"];
  }

  public createEndpoint() {
    let params: any = {
      endpointType: this.endpointType,
      endpointName: this.newEndpointName,
      serverGroup: this.serverGroup.name
    };
    this.$scope.$close();
    this.$state.go("new-endpoint-config", params);
  }
}
