import {ICredentials} from "../../services/authentication/ICredentials";
import {AuthenticationService} from "../../services/authentication/AuthenticationService";
import {DmrService} from "../../services/dmr/DmrService";
import {IStateService} from "angular-ui-router";
import {IScope} from "../../common/IScopeService";
import {BRAND_NAME, BRAND_IMAGE} from "../../common/Constants";

export class LoginCtrl {

  static $inject: string[] = ["$scope", "$state", "authService", "dmrService"];

  public brandName: string = BRAND_NAME;
  public brandImage: string = BRAND_IMAGE;
  public credentials: ICredentials = <ICredentials>{};
  public authenticated: boolean = false;
  public loginError: string;

  constructor(private $scope: IScope,
              private $state: IStateService,
              private authService: AuthenticationService,
              private dmrService: DmrService) {
    if (authService.isLoggedIn()) {
      this.$scope.page.htmlClass = "";
      this.$state.go("containers");
    } else {
      this.$scope.page.htmlClass = "login-pf";
    }
  }

  public login(): void {
    this.authService.login(this.credentials).then(() => {
      this.$scope.page.htmlClass = "";
      this.$state.go("containers");
    }, error => this.loginError = error);
  }

  public alertDismissed(): void {
    this.loginError = null;
    this.$state.go("login", null, {reload: true});
  }
}
