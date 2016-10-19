import {AuthenticationService} from "../../services/authentication/AuthenticationService";
import {IStateService} from "angular-ui-router";

export class NavbarCtrl {
  static $inject: string[] = ["$scope", "$state", "authService", "constants"];

  stateChanging: boolean;

  constructor(private $scope: ng.IScope,
              private $state: IStateService,
              private authService: AuthenticationService,
              private constants:any) {
    this.stateChanging = false;
    $scope.$on("$stateChangeStart", () => this.stateChanging = true);
    $scope.$on("$stateChangeSuccess", () => this.stateChanging = false);
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
