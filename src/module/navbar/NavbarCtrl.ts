import {AuthenticationService} from "../../services/authentication/AuthenticationService";
import {IStateService} from "angular-ui-router";
import {LaunchTypeService} from "../../services/launchtype/LaunchTypeService";
import {IRootScopeService} from "../../common/IRootScopeService";

export class NavbarCtrl {
  static $inject: string[] = ["$rootScope", "$scope", "$state", "authService", "launchType", "user"];

  brandName: string = this.$rootScope.constants.name;
  brandImage: string = this.$rootScope.constants.image;
  showNavbar: boolean;
  stateChanging: boolean;
  states: any[];

  constructor(private $rootScope: IRootScopeService,
              private $scope: ng.IScope,
              private $state: IStateService,
              private authService: AuthenticationService,
              private launchType: LaunchTypeService,
              public user: string) {
    this.stateChanging = false;
    this.showNavbar = true;
    this.states = [
      { name: "container", active: false },
      { name: "server-group", active: false },
      { name: "event", active: false }
    ];

    $scope.$on("$stateChangeStart", () => this.stateChanging = true);
    $scope.$on("$stateChangeSuccess", (event, destinationState) => {
      this.stateChanging = false;
      this.changeState(destinationState, this.states);
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

  private changeState(currentState: any, states: any[]): void {
    states.forEach(state => state.active = currentState.name.includes(state.name));
  }
}
