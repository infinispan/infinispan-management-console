import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {ITransport} from "./ITransport";
import {CompositeOpBuilder, createWriteAttrReq} from "../dmr/CompositeOpBuilder";
import {IDmrCompositeReq} from "../dmr/IDmrCompositeReq";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {ICacheContainer} from "../container/ICacheContainer";
import {getInstanceFromDmr} from "../../common/utils/Utils";
import {IDmrRequest} from "../dmr/IDmrRequest";

const module: ng.IModule = App.module("managementConsole.services.container-config", []);

export class ContainerConfigService {
  static $inject: string[] = ["$q", "dmrService", "launchType"];

  constructor(private $q: ng.IQService,
              private dmrService: DmrService,
              private launchType: LaunchTypeService) {
  }

  getTransportMeta(container: ICacheContainer): ng.IPromise<any> {
    return this.dmrService.readResourceDescription({
      address: this.getContainerAddress(container).concat("transport", "TRANSPORT")
    });
  }

  getTransportConfig(container: ICacheContainer): ng.IPromise<ITransport> {
    let deferred: ng.IDeferred<ITransport> = this.$q.defer<ITransport>();
    let request: IDmrRequest = <IDmrRequest>{address: this.getContainerAddress(container).concat("transport", "TRANSPORT")};
    this.dmrService.readResource(request)
      .then(response => deferred.resolve(getInstanceFromDmr<ITransport>(response)),
        error => deferred.reject(error));
    return deferred.promise;
  }

  saveTransport(container: ICacheContainer, transport: ITransport): ng.IPromise<any> {
    let address: string[] = this.getContainerAddress(container).concat("transport", "TRANSPORT");
    let composite: IDmrCompositeReq = new CompositeOpBuilder()
      .add(createWriteAttrReq(address, "channel", transport.channel))
      .add(createWriteAttrReq(address, "lock-timeout", transport["lock-timeout"]))
      .add(createWriteAttrReq(address, "strict-peer-to-peer", transport["strict-peer-to-peer"]))
      .build();
    return this.dmrService.executePost(composite);
  }

  private getContainerAddress(container: ICacheContainer): string[] {
    let containerPath: string[] = ["subsystem", "datagrid-infinispan", "cache-container", container.name];
    if (this.launchType.isDomainMode()) {
      return ["profile", container.profile].concat(containerPath);
    }
    return containerPath;
  }
}

module.service("containerConfigService", ContainerConfigService);
