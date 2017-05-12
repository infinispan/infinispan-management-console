import {App} from "./ManagementConsole";
import "./services/authentication/AuthenticationService";
import "./services/cache/CacheService";
import "./services/cache-config/CacheConfigService";
import "./services/cluster-events/ClusterEventsService";
import "./services/container/ContainerService";
import "./services/container-config/ContainerConfigService";
import "./services/container-tasks/ContainerTasksService";
import "./services/dmr/DmrService";
import "./services/domain/DomainService";
import "./services/endpoint/EndpointService";
import "./services/jgroups/JGroupsService";
import "./services/launchtype/LaunchTypeService";
import "./services/profile/ProfileService";
import "./services/schemas/SchemasService";
import "./services/security/SecurityService";
import "./services/server/ServerService";
import "./services/server-group/ServerGroupService";
import "./services/socket-binding/SocketBindingService";
import "./services/standalone/StandaloneService";
import "./services/modal/ModalService";
import "./components/cache-loaders/CacheLoaders";
import "./components/cache-security/CacheSecurity";
import "./components/cache-stores/CacheStores";
import "./components/cache-stores/CacheStoreModal";
import "./components/cache-configuration/CacheConfiguration";
import "./components/endpoint-configuration/EndpointConfiguration";
import "./components/configuration-section/ConfigurationSection";
import "./components/forms/field-info/FieldInfo";
import "./components/forms/form-group/FormGroup";
import "./components/memory/Memory";
import "./components/modals/information/InformationModal";
import "./module/auth/Auth";
import "./module/cache-container/CacheContainer";
import "./module/cache-container/config/ContainerConfig";
import "./module/cache-containers/CacheContainers";
import "./module/cache-templates/CacheTemplates";
import "./module/cache/Cache";
import "./module/events/Events";
import "./module/navbar/Navbar";
import "./module/server-group/ServerGroup";
import "./module/server-groups/ServerGroups";
import "./module/server-instance/ServerInstance";

App.element(document).ready(() => {
  App.bootstrap(document, [
    "managementConsole",
    "managementConsole.auth",
    "managementConsole.cache-container",
    "managementConsole.cache-container.config",
    "managementConsole.cache-containers",
    "managementConsole.cache",
    "managementConsole.cache-templates",
    "managementConsole.events",
    "managementConsole.navbar",
    "managementConsole.server-instance",
    "managementConsole.server-group",
    "managementConsole.server-groups",
    "managementConsole.components.cache-loaders",
    "managementConsole.components.memory",
    "managementConsole.components.cache-security",
    "managementConsole.components.cache-stores",
    "managementConsole.components.cache-stores.modal",
    "managementConsole.components.configuration",
    "managementConsole.components.configuration.cache",
    "managementConsole.components.configuration.endpoint",
    "managementConsole.components.forms.field-info",
    "managementConsole.components.forms.form-group",
    "managementConsole.components.modals.information",
    "managementConsole.services.authentication",
    "managementConsole.services.cache",
    "managementConsole.services.cache-config",
    "managementConsole.services.cluster-events",
    "managementConsole.services.container",
    "managementConsole.services.container-config",
    "managementConsole.services.container-tasks",
    "managementConsole.services.dmr",
    "managementConsole.services.domain",
    "managementConsole.services.endpoint",
    "managementConsole.services.jgroups",
    "managementConsole.services.launchtype",
    "managementConsole.services.profile",
    "managementConsole.services.schemas",
    "managementConsole.services.security",
    "managementConsole.services.server",
    "managementConsole.services.server-group",
    "managementConsole.services.socket-binding",
    "managementConsole.services.standalone",
    "managementConsole.services.modal"
  ]);
});
