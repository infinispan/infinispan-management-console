import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {AvailabilityCheck} from "./AvailabilityCheck";
import {isNotNullOrUndefined} from "../../common/utils/Utils";

const module: ng.IModule = App.module("managementConsole.services.authentication", []);

export class AuthenticationService {

  static $inject: string[] = ["$q", "$http", "$interval", "$location", "$window", "$timeout", "dmrService", "availabilityCheck"];

  constructor(private $q: ng.IQService,
              private $http: ng.IHttpService,
              private $interval: ng.IIntervalService,
              private $location: ng.ILocationService,
              private $window: ng.IWindowService,
              private $timeout: ng.ITimeoutService,
              private dmrService: DmrService,
              private availability: AvailabilityCheck) {
  }

  login(): ng.IPromise<string> {
    let deferred: ng.IDeferred<string> = this.$q.defer<string>();
    this.getUser(true).then(user => {
      if (isNotNullOrUndefined(this.availability)) {
        this.availability.stopApiAccessibleCheck();
      }

      this.availability.checkServerIsAlive();
      deferred.resolve(user);
    }, deferred.reject);
    return deferred.promise;
  }

  logout(): void {
    let l: ng.ILocationService = this.$location;
    let logoutUrl: string = `${l.protocol()}://enter-login-here:blah@${l.host()}:${l.port()}/logout?org.jboss.as.console.logout.exit&mechanism=DIGEST`;
    this.availability.stopApiAccessibleCheck();
    this.$http.get(logoutUrl).then(() => this.$window.location.href = "/");
  }

  isApiAvailable(): boolean {
    return this.availability.isApiAccesible();
  }

  getUser(noTimeout?: boolean): ng.IPromise<string> {
    let deferred: ng.IDeferred<string> = this.$q.defer<string>();
    this.dmrService.executePost({
      address: [],
      operation: "whoami"
    }, noTimeout).then(response => deferred.resolve(response.identity.username));
    return deferred.promise;
  }

}

module.service("authService", AuthenticationService);
