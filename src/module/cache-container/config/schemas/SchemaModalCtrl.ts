import CodeMirror = require("codemirror");
import {EditorConfiguration} from "codemirror";
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
  editor: CodeMirror.Editor;

  constructor(private $uibModalInstance: IModalServiceInstance,
              private schemaService: SchemaService,
              private container: ICacheContainer,
              public editing: boolean,
              public schema: ISchemaDefinition) {
    if (!editing) {
      this.schema = <ISchemaDefinition>{};
    }

    // Once modal is rendered, "dress up" modal textarea with CodeMirror editor
    $uibModalInstance.rendered.then(() => {
      let area: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById("container-config.schemas.add.content.text");
      let editorConfig: EditorConfiguration = <EditorConfiguration> {
        lineNumbers: true,
        mode: "protobuf"
      };
      this.editor = CodeMirror.fromTextArea(area, editorConfig);
    });
  }

  createSchema(): void {
    if (!stringEndsWith(this.schema.fileName, ".proto")) {
      this.schema.fileName += ".proto";
    }
    if (this.editor.getValue().length > 0) {
      this.schema.fileContents = this.editor.getValue();
      this.schemaService.registerProtoSchema(this.container, this.schema)
        .then(() => {
            this.successfulOperation = true;
            this.$uibModalInstance.close(true);
          },
          error => {
            this.errorExecuting = true;
            this.errorDescription = error;

          });
    } else {
      this.errorExecuting = true;
      this.errorDescription = "Can not create empty schema!";
    }
  }
}
