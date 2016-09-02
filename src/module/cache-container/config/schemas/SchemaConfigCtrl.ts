import {openConfirmationModal} from "../../../../common/dialogs/Modals";
import {SchemaService} from "../../../../services/schemas/SchemasService";
import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {SchemaModalCtrl} from "./SchemaModalCtrl";
import {ISchemaDefinition} from "../../../../services/schemas/ISchemaDefinition";
import IModalService = angular.ui.bootstrap.IModalService;
import IModalServiceInstance = angular.ui.bootstrap.IModalServiceInstance;
import {IStateService} from "angular-ui-router";

export class SchemaConfigCtrl {

  static $inject: string[] = ["$state", "$uibModal", "schemaService", "container", "availableSchemas"];

  constructor(private $state: IStateService,
              private $uibModal: IModalService,
              private schemaService: SchemaService,
              private container: ICacheContainer,
              public availableSchemas: string[]) {
  }

  createSchemaModal(editing: boolean, schemaName?: string): void {
    let modal: IModalServiceInstance = this.$uibModal.open({
      templateUrl: "module/cache-container/config/schemas/view/schemas-modal.html",
      controller: SchemaModalCtrl,
      controllerAs: "modalCtrl",
      resolve: {
        container: (): ICacheContainer => this.container,
        editing: (): boolean => editing,
        schema: (): ng.IPromise<ISchemaDefinition> => {
          if (editing) {
            return this.schemaService.getProtoSchema(this.container, schemaName);
          }
          return undefined;
        }
      }
    });

    modal.result.then(refresh => {
      if (refresh) {
        this.$state.reload();
      }
    });
  }

  removeSchemaModal(schemaName: string, schemaIndex: number): void {
    let message: string = "Remove schema '" + schemaName + "'?";
    openConfirmationModal(this.$uibModal, message, "pficon pficon-delete")
      .result
      .then(() => this.schemaService.unregisterProtoSchema(this.container, schemaName))
      .then(() => this.availableSchemas.splice(schemaIndex, 1));
  }
}
