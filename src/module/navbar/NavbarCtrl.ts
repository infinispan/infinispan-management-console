import {AuthenticationService} from "../../services/authentication/AuthenticationService";
import {IStateService} from "angular-ui-router";
import {BRAND_NAME, BRAND_IMAGE} from "../../common/Constants";
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";

export class NavbarCtrl {
  static $inject: string[] = ["$scope", "$state", "authService", "launchType"];

  brandName: string = BRAND_NAME;
  brandImage: string = BRAND_IMAGE;
  stateChanging: boolean;

  constructor(private $scope: ng.IScope,
              private $state: IStateService,
              private authService: AuthenticationService,
              private launchType: LaunchTypeService) {
    this.stateChanging = false;
    $scope.$on("$stateChangeStart", () => this.stateChanging = true);
    $scope.$on("$stateChangeSuccess", () => this.stateChanging = false);
  }

  isVisible(): boolean {
    return this.authService.isLoggedIn();
  }

  hasClusterView(): boolean {
    return !this.launchType.isStandaloneLocalMode();
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
