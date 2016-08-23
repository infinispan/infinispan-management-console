import {App} from "../../ManagementConsole";
import {IDmrRequest} from "./IDmrRequest";
import {AuthenticationService} from "../authentication/AuthenticationService";
import {ICredentials} from "../authentication/ICredentials";

const module: ng.IModule = App.module("managementConsole.services.dmr", []);

export class DmrService {

  static $inject: string[] = ["$http", "$q", "authService", "$location"];

  url: string;

  constructor(private $http: ng.IHttpService,
              private $q: ng.IQService,
              private authService: AuthenticationService,
              private $location: ng.ILocationService) {
  }

  readResource(request: IDmrRequest): angular.IPromise<any> {
    request.operation = "read-resource";
    return this.execute(request);
  }

  readAttribute(request: IDmrRequest): angular.IPromise<any> {
    request.operation = "read-attribute";
    return this.execute(request);
  }

  readAttributeAndResolveExpression(request: IDmrRequest): angular.IPromise<any> {
    request.operation = "read-attribute";
    request["resolve-expressions"] = true;
    return this.execute(request);
  }

  writeAttribute(request: IDmrRequest): angular.IPromise<any> {
    request.operation = "write-attribute";
    return this.execute(request);
  }

  readChildResources(request: IDmrRequest): angular.IPromise<any> {
    request.operation = "read-children-resources";
    return this.execute(request);
  }

  private execute(request: IDmrRequest): ng.IPromise<any> {
    var config: any = {
      timeout: 2000,
      withCredentials: true,
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
      }
    };

    var deferred: ng.IDeferred<any> = this.$q.defer<any>();
    var onSuccess: (response: any) => void = (response) => {
      deferred.resolve(response.data.result);
    };

    var onFailure: (response: any) => void = (response) => {
      var status: number = response.status;
      var msg: string = "An unspecified error has been received from the server";
      if (status === 401) {
        msg = "Invalid login or password. Please try again";
      } else {
        console.log(response.data);
        var result: any = response.data
        if (result && result["failure-description"] != null) {
          msg = result["failure-description"];
        }
      }
      console.log(msg);
      deferred.reject(msg);
    };

    this.url = this.url === undefined ? this.generateUrl(this.authService.getCredentials()) : this.url;
    this.$http.post(this.url, JSON.stringify(request), config).then(onSuccess, onFailure);
    return deferred.promise;
  }

  private generateUrl(c: ICredentials): string {
    var l: ng.ILocationService = this.$location;
    return `${l.protocol()}://${c.username}:${c.password}@${l.host()}:${l.port()}/management`;
  }
}

module.service("dmrService", DmrService);
