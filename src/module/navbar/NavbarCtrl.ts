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
  states: any[];

  constructor(private $scope: ng.IScope,
              private $state: IStateService,
              private authService: AuthenticationService,
              private launchType: LaunchTypeService,
              public user: string) {
    this.stateChanging = false;
    this.showNavbar = true;
    this.states = [
      { name: 'container', active: false },
      { name: 'server-group', active: false },
      { name: 'event', active: false }
    ];

    const changeState = (currentState, states) => states.forEach(state => state.active = currentState.name.includes(state.name));
    $scope.$on("$stateChangeStart", () => this.stateChanging = true);
    $scope.$on("$stateChangeSuccess", (event, destinationState) => {
      this.stateChanging = false;
      changeState(destinationState, this.states);
    });
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
