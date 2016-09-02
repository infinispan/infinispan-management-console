import {App} from "../../ManagementConsole";
import {DmrService} from "../dmr/DmrService";
import {JGroupsService} from "../jgroups/JGroupsService";
import {IServerAddress} from "../server/IServerAddress";
import {ICacheContainer} from "../container/ICacheContainer";
import {ISchemaDefinition} from "./ISchemaDefinition";

const module: ng.IModule = App.module("managementConsole.services.schemas", []);

export class SchemaService {

  static $inject: string[] = ["$q", "dmrService", "jGroupsService"];

  constructor(private $q: ng.IQService,
              private dmrService: DmrService,
              private jGroupsService: JGroupsService) {

  }

  getProtoSchema(container: ICacheContainer, schemaName: string): ng.IPromise<ISchemaDefinition> {
    let deferred: ng.IDeferred<ISchemaDefinition> = this.$q.defer<ISchemaDefinition>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
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
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
      .then(coordinator => {
        return this.dmrService.executePost({
          address: this.getContainerAddress(container.name, coordinator),
          operation: "get-proto-schema-names"
        });
      })
      .then(names => deferred.resolve(names));
    return deferred.promise;
  }

  registerProtoSchema(container: ICacheContainer, schema: ISchemaDefinition): ng.IPromise<void> {
    let deferred: ng.IDeferred<void> = this.$q.defer<void>();
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
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
    this.jGroupsService.getServerGroupCoordinator(container.serverGroup)
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

  private getContainerAddress(container: string, coordinator: IServerAddress): string[] {
    return [].concat("host", coordinator.host, "server", coordinator.name, "subsystem", "datagrid-infinispan",
      "cache-container", container);
  }

}

module.service("schemaService", SchemaService);
