import {AuthenticationService} from "../../services/authentication/AuthenticationService";
import {IStateService} from "angular-ui-router";
import {BRAND_NAME, BRAND_IMAGE} from "../../common/Constants";
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";

export class NavbarCtrl {
  static $inject: string[] = ["$scope", "$state", "authService", "launchType", "user"];

  brandName: string = BRAND_NAME;
  brandImage: string = BRAND_IMAGE;
  showNavbar: boolean;
  stateChanging: boolean;

  constructor(private $scope: ng.IScope,
              private $state: IStateService,
              private authService: AuthenticationService,
              private launchType: LaunchTypeService,
              public user: string) {
    this.stateChanging = false;
    this.showNavbar = true;
    $scope.$on("$stateChangeStart", () => this.stateChanging = true);
    $scope.$on("$stateChangeSuccess", () => this.stateChanging = false);
  }

  isVisible(): boolean {
    return this.showNavbar;
  }

  hasClusterView(): boolean {
    return !this.launchType.isStandaloneLocalMode();
  }

  logout(): void {
    this.showNavbar = false;
    this.$state.go("logout", null, {reload: true});
  }

  isApiAvailable(): boolean {
    return this.authService.isApiAvailable();
  }
}
