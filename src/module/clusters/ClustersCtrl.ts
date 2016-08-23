import {IStateService} from "angular-ui-router";
import {IScope} from "../../common/IScopeService";
import {DmrService} from "../../services/dmr/DmrService";
import {EndpointService} from "../../services/endpoint/EndpointService";
import {IEndpoint} from "../../services/endpoint/IEndpoint";
import {ProfileService} from "../../services/profile/ProfileService";
import {ServerGroupService} from "../../services/server-group/ServerGroupService";
import {ContainerService} from "../../services/container/ContainerService";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {IDomain} from "../../services/domain/IDomain";
import {DomainService} from "../../services/domain/DomainService";
import {JGroupsService} from "../../services/jgroups/JGroupsService";
import {IMap} from "../../services/utils/IDictionary";
import {UtilsService} from "../../services/utils/UtilsService";

/**
 * Known limitations:
 *  - If a profile is utilised by two server-groups, then only the first group and endpoints are displayed
 */
export class ClustersCtrl {

  static $inject: string[] = ["$scope", "$state", "dmrService", "containerService", "endpointService", "profileService",
    "serverGroupService", "domainService", "jGroupsService", "utils"];

  containers: ICacheContainer[];
  domain: IDomain;
  stacks: IMap<string>;

  constructor(private $scope: IScope, private $state: IStateService, private dmrService: DmrService,
              private containerService: ContainerService, private endpointService: EndpointService,
              private profileService: ProfileService, private serverGroupService: ServerGroupService,
              private domainService: DomainService, private jGroupsService: JGroupsService,
              private utils: UtilsService) {

    this.containerService.getAllContainers().then((containers) => this.containers = containers);
    this.domainService.getHostsAndServers()
      .then((domain) => {
        this.domain = domain;
        return this.jGroupsService.getDefaultStackServerGroupDict(domain.controller);
      })
      .then((stacks) => this.stacks = stacks);
  }

  getDefaultStack(container: ICacheContainer): string {
    if (this.utils.isNotNullOrUndefined(this.stacks)) {
      let serverGroup: string = container.serverGroup.name;
      return this.stacks[serverGroup];
    }
    return "";
  }

  getAvailabilityClass(container: ICacheContainer): string {
    return container.available ? "label-success" : "label-danger";
  }

  getAvailability(container: ICacheContainer): string {
    return container.available ? "AVAILABLE" : "DEGRADED";
  }
}
