import {App} from "../../ManagementConsole";
import {ICredentials} from "services/authentication/ICredentials";
import {DmrService} from "../dmr/DmrService";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import ILocalStorageService = angular.local.storage.ILocalStorageService;

const module:ng.IModule = App.module("managementConsole.services.authentication", ["LocalStorageModule"]);

export class AuthenticationService {

  static $inject:string[] = ["$http", "$q", "$location", "localStorageService", "launchType"];

  credentials: ICredentials = <ICredentials>{};

  constructor(private $http: ng.IHttpService,
              private $q: ng.IQService,
              private $location: ng.ILocationService,
              private localStorageService: ILocalStorageService,
              private launchType: LaunchTypeService) {
                this.credentials.username = localStorageService.get<string>("username");
                this.credentials.username = localStorageService.get<string>("password");
              }

  isLoggedIn(): boolean {
    return this.credentials.username !== undefined;
  }

  login(credentials: ICredentials): ng.IPromise<string> {
    this.setCredentials(credentials);
    // we need to create the DmrService manually to avoid a circular dependency with inject
    var dmr: DmrService = new DmrService(this.$http, this.$q, this, this.$location);
    var deferred: ng.IDeferred<string> = this.$q.defer();

    var onSuccess: (response: string) => void = (response) => {
      this.setCredentials(credentials);
      try {
        this.launchType.set(response);
        deferred.resolve();
      } catch (msg) {
        deferred.reject(msg);
      }
    };

    var onFailure: (errorMsg: string) => void = (errorMsg) => {
      this.logout();
      deferred.reject(errorMsg);
    };
    dmr.readAttribute({address: [], name: "launch-type"}).then(onSuccess, onFailure);
    return deferred.promise;
  }

  logout(): void {
    this.setCredentials(<ICredentials>{});
  }

  getCredentials(): ICredentials {
    return this.credentials;
  }

  getUser(): string {
    return this.credentials.username;
  }

  private setCredentials(credentials: ICredentials): void {
    this.credentials = credentials;
    this.localStorageService.set("username", credentials.username);
    this.localStorageService.set("password", credentials.password);
  }
}

module.service("authService", AuthenticationService);
