import {ICredentials} from "../../services/authentication/ICredentials";
import {AuthenticationService} from "../../services/authentication/AuthenticationService";
import {DmrService} from "../../services/dmr/DmrService";
import {IStateService} from "angular-ui-router";
import {IScope} from "../../common/IScopeService";

export class LoginCtrl {

  static $inject: string[] = ["$scope", "$state", "authService", "dmrService"];

  public credentials: ICredentials = <ICredentials>{};
  public authenticated: boolean = false;
  public showLoginSpinner: boolean = false;
  public loginError: string;

  constructor(private $scope: IScope, private $state: IStateService, private authService: AuthenticationService, private dmrService: DmrService) {
    var htmlClass: string = authService.isLoggedIn() ? "" : "login-pf";
    this.$scope.page.htmlClass = htmlClass;
  }

  public login(): void {
    this.showLoginSpinner = true;

    var onSuccess: () => void = () => {
      this.showLoginSpinner = false;
      this.$scope.page.htmlClass = "";
      this.$state.go("clusters");
    };

    var onFailure: (errorMsg: string) => void = (errorMsg) => {
      this.loginError = errorMsg;
      this.showLoginSpinner = false;
    };

    this.authService.login(this.credentials).then(onSuccess, onFailure);
  }

  public alertDismissed(): void {
    this.loginError = null;
    this.$state.go("login", null, {reload: true});
  }
}
