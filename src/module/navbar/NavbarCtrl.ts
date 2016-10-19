import {AuthenticationService} from "../../services/authentication/AuthenticationService";
import {IStateService} from "angular-ui-router";
import {BRAND_NAME, BRAND_IMAGE} from "../../common/Constants";
import {JGroupsService} from "../../services/jgroups/JGroupsService";

export class NavbarCtrl {
  static $inject: string[] = ["$scope", "$state", "authService", "jGroupsService"];

  brandName: string = BRAND_NAME;
  brandImage: string = BRAND_IMAGE;
  stateChanging: boolean;

  constructor(private $scope: ng.IScope,
              private $state: IStateService,
              private authService: AuthenticationService,
              private jGroupsService: JGroupsService) {
    this.stateChanging = false;
    $scope.$on("$stateChangeStart", () => this.stateChanging = true);
    $scope.$on("$stateChangeSuccess", () => this.stateChanging = false);
  }

  isVisible(): boolean {
    return this.authService.isLoggedIn();
  }

  hasClusterView(): boolean {
    let stack:boolean = this.jGroupsService.hasJGroupsStack();
    return stack;
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
