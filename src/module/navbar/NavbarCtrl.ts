import {AuthenticationService} from "../../services/authentication/AuthenticationService";
import {IStateService} from "angular-ui-router";

export class NavbarCtrl {
  static $inject: string[] = ["$scope", "$state", "authService"];

  constructor(private $scope: ng.IScope, private $state: IStateService, private authenticationService: AuthenticationService) {
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
}
