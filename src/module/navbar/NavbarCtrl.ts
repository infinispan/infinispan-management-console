import {AuthenticationService} from "../../services/authentication/AuthenticationService";
import {IStateService} from "angular-ui-router";

export class NavbarCtrl {
  static $inject: string[] = ["$scope", "$state", "authService"];

  constructor(private $scope: ng.IScope, private $state: IStateService, private authService: AuthenticationService) {
  }

  isVisible(): boolean {
    return this.authService.isLoggedIn();
  }

  getUser(): string {
    return this.authService.getUser();
  }

  logout(): void {
    this.$state.go("logout");
  }

  isApiAvailable(): boolean {
    return this.authService.isApiAvailable();
  }
}
