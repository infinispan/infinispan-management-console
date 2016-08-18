import {App} from "./ManagementConsole";
import "./services/authentication/AuthenticationService";
import "./services/dmr/DmrService";
import "./services/launchtype/LaunchTypeService";
import "./module/auth/Auth";
import "./module/clusters/Clusters";

App.element(document).ready(() => {
  App.bootstrap(document, [
    "managementConsole",
    "managementConsole.auth",
    "managementConsole.clusters",
    "managementConsole.services.authentication",
    "managementConsole.services.dmr",
    "managementConsole.services.launchtype"
  ]);
});
