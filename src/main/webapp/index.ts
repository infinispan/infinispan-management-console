import {App} from "./App";
import "./management-console";
import "./clusters-view/clusters-view";
import "./error404/error404";
import "./login/login";
import "./components/api/api";
import "./components/api/model-controller.service";
import "./components/api/domain-model.service";
import "./components/api/cluster-model.service";
import "./components/api/cache-model.service";
import "./components/api/endpoint-model.service";
import "./components/api/profile-model.service";
import "./components/api/server-model.service";
import "./components/api/servergroup-model.service";
import "./components/services/utils";

App.element(document).ready(() => {
  App.bootstrap(document, [
    "managementConsole",
    "managementConsole.clusters-view",
    "managementConsole.error",
    "managementConsole.login",
    "managementConsole.api.model-controller",
    "managementConsole.api.domain-model",
    "managementConsole.api.cluster-model",
    "managementConsole.api.cache-model",
    "managementConsole.api.endpoint-model",
    "managementConsole.api.profile-model",
    "managementConsole.api.server-model",
    "managementConsole.api.servergroup-model",
    "managementConsole.services.utils",
  ]);
});
