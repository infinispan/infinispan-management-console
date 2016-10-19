import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {JGroupsService} from "../jgroups/JGroupsService";
import {IServerAddress} from "../server/IServerAddress";
import {ICacheContainer} from "../container/ICacheContainer";
import {ISchemaDefinition} from "./ISchemaDefinition";
import {LaunchTypeService} from "../launchtype/LaunchTypeService";
import {IDmrRequest} from "../dmr/IDmrRequest";
import {IServerGroup} from "../server-group/IServerGroup";

const module: ng.IModule = App.module("managementConsole.services.schemas", []);

export class SchemaService {

  static $inject: string[] = ["$q", "dmrService", "jGroupsService", "launchType"];

  constructor(private $q: ng.IQService,
              private dmrService: DmrService,
              private jGroupsService: JGroupsService,
              private launchType: LaunchTypeService) {

  }

  getProtoSchema(container: ICacheContainer, schemaName: string): ng.IPromise<ISchemaDefinition> {
    let deferred: ng.IDeferred<ISchemaDefinition> = this.$q.defer<ISchemaDefinition>();
    this.findTarget(container.serverGroup)
      .then(coordinator => {
          return this.dmrService.executePost({
            address: this.getContainerAddress(container.name, coordinator),
            operation: "get-proto-schema",
            "file-name": schemaName
          });
        },
        error => deferred.reject(error))
      .then(schema => deferred.resolve({fileName: schemaName, fileContents: schema}));
    return deferred.promise;
  }

  getProtoSchemaNames(container: ICacheContainer): ng.IPromise<string[]> {
    let deferred: ng.IDeferred<string[]> = this.$q.defer<string[]>();
    this.findTarget(container.serverGroup).then(coordinator => {
        return this.dmrService.executePost({
          address: this.getContainerAddress(container.name, coordinator),
          operation: "get-proto-schema-names"
        }).then(names => deferred.resolve(names));
      },
      error => deferred.reject(error));
    return deferred.promise;
  }

  registerProtoSchema(container: ICacheContainer, schema: ISchemaDefinition): ng.IPromise<void> {
    let deferred: ng.IDeferred<void> = this.$q.defer<void>();
    this.findTarget(container.serverGroup)
      .then(coordinator => {
          return this.dmrService.executePost({
            address: this.getContainerAddress(container.name, coordinator),
            operation: "register-proto-schemas",
            "file-names": [schema.fileName],
            "file-contents": [schema.fileContents]
          });
        },
        error => deferred.reject(error))
      .then(() => deferred.resolve(), error => deferred.reject(error));
    return deferred.promise;
  }

  unregisterProtoSchema(container: ICacheContainer, fileName: string): ng.IPromise<void> {
    let deferred: ng.IDeferred<void> = this.$q.defer<void>();
    this.findTarget(container.serverGroup)
      .then(coordinator => {
        return this.dmrService.executePost({
          address: this.getContainerAddress(container.name, coordinator),
          operation: "unregister-proto-schemas",
          "file-names": [fileName]
        });
      })
      .then(() => deferred.resolve());
    return deferred.promise;
  }

  private findTarget(serverGroup: IServerGroup): ng.IPromise<IServerAddress> {
    if (this.launchType.isStandaloneLocalMode()) {
      return this.$q.when(null);
    } else {
      return this.jGroupsService.getServerGroupCoordinator(serverGroup);
    }
  }

  private getContainerAddress(container: string, coordinator: IServerAddress): string[] {
    let path: string [] = ["subsystem", "datagrid-infinispan", "cache-container", container];
    return this.launchType.getRuntimePath(coordinator).concat(path);
  }

}

module.service("schemaService", SchemaService);
