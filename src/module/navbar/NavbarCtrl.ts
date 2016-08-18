import {AuthenticationService} from "../../services/authentication/AuthenticationService";
import {IStateService} from "angular-ui-router";
import {ServerService} from "../../services/server/ServerService";

export class NavbarCtrl {
  static $inject: string[] = ["$scope", "$state", "authService", "serverService"];

  constructor(private $scope: ng.IScope, private $state: IStateService, private authenticationService: AuthenticationService,
              private serverService: ServerService) {
  }

  isVisible(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  getUser(): string {
    return this.authenticationService.getUser();
  }

  logOut(): void {
    this.authenticationService.logout();
    this.$state.go("login");
  }

  isServerAlive(): boolean {
    return this.serverService.isManagementApiAccessible();
  }
}
