import {App} from "../../ManagementConsole";
import {ICredentials} from "services/authentication/ICredentials";
import {DmrService} from "../dmr/DmrService";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import ILocalStorageService = angular.local.storage.ILocalStorageService;
import {AvailabilityCheck} from "./AvailabilityCheck";
import {isNotNullOrUndefined, isNullOrUndefined} from "../../common/utils/Utils";

const module: ng.IModule = App.module("managementConsole.services.authentication", ["LocalStorageModule"]);

export class AuthenticationService {

  static $inject: string[] = ["$http", "$cacheFactory", "$q", "$location", "$interval", "localStorageService", "launchType"];

  private credentials: ICredentials = <ICredentials>{};
  private availability: AvailabilityCheck;
  private dmrService: DmrService;

  constructor(private $http: ng.IHttpService,
              private $cacheFactory: ng.ICacheFactoryService,
              private $q: ng.IQService,
              private $location: ng.ILocationService,
              private $interval: ng.IIntervalService,
              private localStorageService: ILocalStorageService,
              private launchType: LaunchTypeService) {
    this.getCredentials();

    // we need to create the DmrService manually to avoid a circular dependency with inject
    this.dmrService = new DmrService(this.$http, this.$cacheFactory, this.$q, this, this.$location);
    this.availability = new AvailabilityCheck(this.$interval, this.dmrService);
  }

  isLoggedIn(): boolean {
    let credentials: ICredentials = this.getCredentials();
    return isNotNullOrUndefined(credentials.username) && isNotNullOrUndefined(credentials.password);
  }

  login(credentials: ICredentials): ng.IPromise<string> {
    this.setCredentials(credentials);
    let deferred: ng.IDeferred<string> = this.$q.defer();
    this.dmrService.readResource({
      address: [],
      recursive: true,
      "include-runtime": true,
      "recursive-depth": 2
    }).then((response: any) => {
      let hasJGroupsStack: boolean = true;
      let launchType: string = response["launch-type"];
      if (LaunchTypeService.STANDALONE_MODE === launchType) {
        hasJGroupsStack = isNotNullOrUndefined(response.subsystem["datagrid-jgroups"]);
      }
      this.launchType.set(launchType, hasJGroupsStack);
      this.setCredentials(credentials);
      this.availability.startApiAccessibleCheck();
      deferred.resolve();
    }, error => {
      this.logout();
      deferred.reject(error);
    });
    return deferred.promise;
  }

  logout(): void {
    this.setCredentials(<ICredentials>{});
    this.availability.stopApiAccessibleCheck();
  }

  getCredentials(): ICredentials {
    if (isNullOrUndefined(this.credentials.username) || isNullOrUndefined(this.credentials.password)) {
      this.credentials = this.getLocalCredentials();
    }
    return this.credentials;
  }

  getUser(): string {
    return this.credentials.username;
  }

  isApiAvailable(): boolean {
    return this.availability.isApiAccesible();
  }

  private getLocalCredentials(): ICredentials {
    return {
      username: this.localStorageService.get<string>("username"),
      password: this.localStorageService.get<string>("password")
    };
  }

  private setCredentials(credentials: ICredentials): void {
    this.credentials = credentials;
    this.localStorageService.set("username", credentials.username);
    this.localStorageService.set("password", credentials.password);
  }
}

module.service("authService", AuthenticationService);
