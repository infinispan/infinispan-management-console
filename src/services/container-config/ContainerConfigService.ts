import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {ITransport} from "./ITransport";
import {CompositeOpBuilder, createWriteAttrReq} from "../dmr/CompositeOpBuilder";
import {IDmrCompositeReq} from "../dmr/IDmrCompositeReq";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {ICacheContainer} from "../container/ICacheContainer";
import {getInstanceFromDmr, isNotNullOrUndefined, deepGet} from "../../common/utils/Utils";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {ITemplate} from "./ITemplate";

const module: ng.IModule = App.module("managementConsole.services.container-config", []);

export class ContainerConfigService {
  static $inject: string[] = ["$q", "dmrService", "launchType"];

  private genericThreadPools: string[] = ["async-operations", "listener", "persistence", "remote-command",
    "state-transfer", "transport"];
  private genericThreadPoolFields: string[] = ["keepalive-time", "max-threads", "min-threads", "queue-length"];

  constructor(private $q: ng.IQService,
              private dmrService: DmrService,
              private launchType: LaunchTypeService) {
  }

  getAllContainerTemplates(container: ICacheContainer): ng.IPromise<ITemplate[]> {
    let deferred: ng.IDeferred<ITemplate[]> = this.$q.defer<ITemplate[]>();
    let request: IDmrRequest = <IDmrRequest>{
      address: this.getContainerAddress(container).concat("configurations", "CONFIGURATIONS"),
      "recursive-depth": 1
    };

    this.dmrService.readResource(request).then(
      response => deferred.resolve(this.extractTemplatesFromConfigurations(response)),
      error => deferred.reject(error));
    return deferred.promise;
  }

  removeContainerTemplate(container: ICacheContainer, template: ITemplate): ng.IPromise<void> {
    let address: string[] = this.getContainerAddress(container).concat("configurations", "CONFIGURATIONS",
      template.type, template.name);

    return this.dmrService.executePost({
      address: address,
      operation: "remove"
    });
  }

  getContainerMeta(container: ICacheContainer): ng.IPromise<any> {
    return this.dmrService.readResourceDescription({
      address: this.getContainerAddress(container),
      recursive: true
    });
  }

  getThreadPoolsConfig(container: ICacheContainer): ng.IPromise<any> {
    return this.dmrService.readChildResources({
      address: this.getContainerAddress(container),
      "child-type": "thread-pool",
      recursive: true
    });
  }

  saveThreadPools(container: ICacheContainer, threadPools: any): ng.IPromise<any> {
    let builder: CompositeOpBuilder = new CompositeOpBuilder();
    let address: string[] = this.getContainerAddress(container).concat("thread-pool");

    // Add generic thread pools to composite operation
    this.genericThreadPools.forEach(poolName => {
      this.addThreadPoolToBuilder(address.concat(poolName), this.genericThreadPoolFields, threadPools[poolName], builder);
    });
    this.addThreadPoolToBuilder(address.concat("expiration"), ["keepalive-time", "max-threads"], threadPools.expiration, builder);
    this.addThreadPoolToBuilder(address.concat("replication-queue"), ["keepalive-time", "max-threads"], threadPools["replication-queue"], builder);
    return this.dmrService.executePost(builder.build());
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

  private addThreadPoolToBuilder(address: string[], fields: string[], valueMap: any, builder: CompositeOpBuilder): CompositeOpBuilder {
    fields.forEach(field => builder.add(createWriteAttrReq(address, field, valueMap[field])));
    return builder;
  }

  private extractTemplatesFromConfigurations(config: any): ITemplate[] {
    let templateArray: ITemplate[] = [];
    angular.forEach(config, (templates, templateType) => {
      angular.forEach(templates, (template, templateName) => {
        templateArray.push({
          name: templateName,
          mode: template.mode,
          type: templateType,
          traits: this.extractTraitsFromTemplate(template)
        });
      });
    });
    return templateArray;
  }

  private extractTraitsFromTemplate(template: any): string[] {
    let traits: string[] = [];
    if (isNotNullOrUndefined(template.backup)) {
      traits.push("Remotely Backedup");
    }
    if (isNotNullOrUndefined(template.compatibility)) {
      traits.push("Compatible");
    }
    if (isNotNullOrUndefined(template.indexing)) {
      traits.push("Indexed");
    }
    if (isNotNullOrUndefined(template.eviction)) {
      traits.push("Bounded");
    }
    let transactionMode: any = deepGet(template, "transaction.TRANSACTION.mode");
    if (isNotNullOrUndefined(transactionMode) && transactionMode !== "NONE") {
      traits.push("Transactional");
    }
    let securityEnabled: boolean = deepGet(template, "security.SECURITY.authorization.AUTHORIZATION.enabled");
    if (isNotNullOrUndefined(securityEnabled) && securityEnabled) {
      traits.push("Secured");
    }
    return traits;
  }
}

module.service("containerConfigService", ContainerConfigService);
