import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {ISchemaDefinition} from "../../../../services/schemas/ISchemaDefinition";
import {SchemaService} from "../../../../services/schemas/SchemasService";
import {stringEndsWith} from "../../../../common/utils/Utils";
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;

export class SchemaModalCtrl {

  static $inject: string[] = ["$uibModalInstance", "schemaService", "container", "editing", "schema"];

  errorExecuting: boolean = false;
  errorDescription: string = "";
  successfulOperation: boolean = false;

  constructor(private $uibModalInstance: IModalServiceInstance,
              private schemaService: SchemaService,
              private container: ICacheContainer,
              public editing: boolean,
              public schema: ISchemaDefinition) {
    if (!editing) {
      this.schema = <ISchemaDefinition>{};
    }
  }

  createSchema(): void {
    if (!stringEndsWith(this.schema.fileName, ".proto")) {
      this.schema.fileName += ".proto";
    }

    this.schemaService.registerProtoSchema(this.container, this.schema)
      .then(() => {
          this.successfulOperation = true;
          if (!this.editing) {
            this.$uibModalInstance.close(true);
          }
        },
        error => {
          this.errorExecuting = true;
          this.errorDescription = error;
        });
  }
}
