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
import {IDictionary} from "../../services/utils/IDictionary";

export class ClustersCtrl {

  static $inject: string[] = ["$scope", "$state", "dmrService", "containerService", "endpointService", "profileService",
    "serverGroupService", "domainService", "jGroupsService"];

  containers: ICacheContainer[];
  domain: IDomain;
  stacks: IDictionary<string>;

  constructor(private $scope: IScope, private $state: IStateService, private dmrService: DmrService,
              private containerService: ContainerService, private endpointService: EndpointService,
              private profileService: ProfileService, private serverGroupService: ServerGroupService,
              private domainService: DomainService, private jGroupsService: JGroupsService) {

    this.containerService.getAllContainers().then((containers) => this.containers = containers);
    this.domainService.getControllerAndServers()
      .then((domain) => {
        this.domain = domain;
        return this.jGroupsService.getDefaultStackServerGroupDict(domain.master);
      })
      .then((stacks) => this.stacks = stacks);
  }

  getDefaultStack(container: ICacheContainer): string {
    let serverGroup: string = container.serverGroup.name;
    return this.stacks[serverGroup];
  }
}
