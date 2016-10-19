import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {ITransport} from "./ITransport";
import {CompositeOpBuilder, createWriteAttrReq} from "../dmr/CompositeOpBuilder";
import {IDmrCompositeReq} from "../dmr/IDmrCompositeReq";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {ICacheContainer} from "../container/ICacheContainer";
import {getInstanceFromDmr} from "../../common/utils/Utils";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {JGroupsService} from "../jgroups/JGroupsService";
import {IServerAddress} from "../server/IServerAddress";
import {ITask} from "../task/ITask";
import {IRole} from "../security/IRole";

const module: ng.IModule = App.module("managementConsole.services.container-config", []);

export class ContainerConfigService {
  static $inject: string[] = ["$q", "dmrService", "jGroupsService", "launchType"];

  private genericThreadPools: string[] = ["async-operations", "listener", "persistence", "remote-command",
    "state-transfer", "transport"];
  private genericThreadPoolFields: string[] = ["keepalive-time", "max-threads", "min-threads", "queue-length"];

  constructor(private $q: ng.IQService,
              private dmrService: DmrService,
              private jGroupsService: JGroupsService,
              private launchType: LaunchTypeService) {
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

  uploadAndDeployArtifact(deployment: File): ng.IPromise<any> {
    let request: IDmrRequest = <IDmrRequest>{
      operation: "add",
      address: ["deployment", deployment.name],
      "runtime-name": deployment.name,
      enabled: false,
      content: [{"input-stream-index": 0}]
    };
    return this.dmrService.executeFileUpload(request, deployment);
  }

  deployArtifact(container: ICacheContainer, deployment: string): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: "add",
      enabled: true,
      address: ["server-group", container.serverGroup.name, "deployment", deployment]
    });
  }

  undeployArtifact(container: ICacheContainer, deployment: string): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: "remove",
      address: ["server-group", container.serverGroup.name, "deployment", deployment]
    });
  }

  removeArtifact(container: ICacheContainer, deployment: string): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: "remove",
      address: ["deployment", deployment]
    });
  }

  getDeployedArtifact(container: ICacheContainer): ng.IPromise<any> {
    return this.dmrService.readResource({
      address: ["server-group", container.serverGroup.name, "deployment", "*"],
      recursive: true
    });
  }

  getArtifacts(): ng.IPromise<any> {
    return this.dmrService.readChildResources({
      address: [],
      "child-type": "deployment",
      recursive: false
    });
  }

  deployScript(container: ICacheContainer, task: ITask, body: string): ng.IPromise<any> {
    return this.getCacheContainerDMRAddressForCoordinator(container).then((address: string[]) => {
      return this.dmrService.executePost({
        operation: "script-add",
        address: address,
        name: task.name,
        code: body
      });
    });
  }

  removeScript(container: ICacheContainer, script: ITask): ng.IPromise<any> {
    return this.executeScriptOp(container, "script-remove", script);
  }

  loadScriptBody(container: ICacheContainer, script: ITask): ng.IPromise<string> {
    return this.executeScriptOp(container, "script-cat", script);
  }

  loadScriptTasks(container: ICacheContainer): ng.IPromise<ITask[]> {
    let deferred: ng.IDeferred<ITask[]> = this.$q.defer<ITask[]>();
    let tasks: ITask [] = [];
    this.getCacheContainerDMRAddressForCoordinator(container).then((address: string[]) => {
      let request: IDmrRequest = {
        operation: "task-list",
        address: address
      };
      this.dmrService.executePost(request).then((response: any[]) => {
        for (let r of response) {
          tasks.push(<ITask>r);
        }
      }).finally(() => {
        deferred.resolve(tasks);
      });
    });
    return deferred.promise;
  }

  getSecurityConfig(container: ICacheContainer): ng.IPromise<any> {
    let deferred: ng.IDeferred<any> = this.$q.defer<any>();
    let request: IDmrRequest = <IDmrRequest>{
      address: this.getContainerAddress(container).concat("security", "SECURITY"),
      recursive: true
    };
    this.dmrService.readResource(request)
      .then(response => deferred.resolve(response),
        error => deferred.reject(error));
    return deferred.promise;
  }

  addSecurity(container: ICacheContainer): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: "add",
      address: this.getContainerAddress(container).concat("security", "SECURITY")
    });
  }

  addAuthorization(container: ICacheContainer): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: "add",
      address: this.getContainerAddress(container).concat("security", "SECURITY", "authorization", "AUTHORIZATION"),
      "audit-logger": undefined,
      mapper: "org.infinispan.security.impl.IdentityRoleMapper"
    });
  }

  loadRole(container: ICacheContainer, role: IRole): ng.IPromise<IRole> {
    let deferred: ng.IDeferred<IRole> = this.$q.defer<IRole>();
    let request: IDmrRequest = {
      address: this.getSecurityRoleAddress(container, role)
    };
    this.dmrService.readResource(request).then((response) => deferred.resolve(<IRole>response));
    return deferred.promise;
  }

  addRole(container: ICacheContainer, role: IRole): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: "add",
      name: role.name,
      permissions: role.permissions,
      address: this.getSecurityRoleAddress(container, role)
    });
  }

  editRole(container: ICacheContainer, role: IRole): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: "write-attribute",
      name: "permissions",
      value: role.permissions,
      address: this.getSecurityRoleAddress(container, role)
    });
  }

  removeRole(container: ICacheContainer, role: IRole): ng.IPromise<any> {
    return this.dmrService.executePost({
      operation: "remove",
      address: this.getSecurityRoleAddress(container, role)
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

  private getSecurityRoleAddress(container: ICacheContainer, role: IRole): string[] {
    return this.getContainerAddress(container).concat("security", "SECURITY", "authorization", "AUTHORIZATION", "role", role.name);
  }

  private addThreadPoolToBuilder(address: string[], fields: string[], valueMap: any, builder: CompositeOpBuilder): CompositeOpBuilder {
    fields.forEach(field => builder.add(createWriteAttrReq(address, field, valueMap[field])));
    return builder;
  }

  private executeScriptOp(container: ICacheContainer, op: string, script: ITask): ng.IPromise<any> {
    return this.getCacheContainerDMRAddressForCoordinator(container).then((address: string[]) => {
      let request: IDmrRequest = {
        operation: op,
        address: address,
        name: script.name
      };
      return this.dmrService.executePost(request);
    });
  }

  private getCacheContainerDMRAddressForCoordinator(container: ICacheContainer): ng.IPromise<string[]> {
    return this.jGroupsService.getServerGroupCoordinator(container.serverGroup).then((server: IServerAddress) => {
      return this.getCacheContainerAddress(server, container);
    });
  }

  private getCacheContainerAddress(server: IServerAddress, container: ICacheContainer): string[] {
    let path: string[] = ["subsystem", "datagrid-infinispan", "cache-container", container.name];
    return this.launchType.getRuntimePath(server).concat(path);
  }
}

module.service("containerConfigService", ContainerConfigService);
