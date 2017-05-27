import {EndpointService} from './../../../services/endpoint/EndpointService';

export class EndpointModalCtrl {
  static $inject: string[] = ["endpointType", "serverGroup", "endpointService", "$scope", "$state"];

  public endpointTypes: string[];
  public newEndpointName: string;

  constructor(public endpointType: string,
              public serverGroup: any,
              public endpointService: EndpointService,
              public $scope: any,
              public $state: any) {

    this.endpointService
    .getConfigurationMeta('clustered', 'datagrid-infinispan-endpoint', '')
    .then(meta => {
      this.endpointTypes = Object.keys(meta.children).map(child => child);
      this.endpointType = this.endpointTypes[0];
    });
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
