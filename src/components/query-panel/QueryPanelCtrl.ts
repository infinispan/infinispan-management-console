import CodeMirror = require("codemirror");
import {RestService} from "../../services/rest/RestService";
import {EditorConfiguration} from "codemirror";
import {isNotNullOrUndefined, isObject} from "../../common/utils/Utils";

export class QueryPanelCtrl implements ng.IComponentController {
  static $inject: string[] = ["restService", "$timeout"];

  cacheName: string;
  name: string;
  description: string;
  statusCode: number;
  editor: CodeMirror.Editor;
  panelType:string;
  inputParams: string [];

  constructor(private restService: RestService, private $timeout: ng.ITimeoutService) {
  }

  executeAction(): void {
    this.executionActionHelper().then((response: any) => {
      this.statusCode = response.status;
      let responseText: string = response.statusText;
      if (isNotNullOrUndefined(response.data) && isObject(response.data)) {
        responseText = JSON.stringify(response.data, null, "\t");
      }
      this.editor.setValue(responseText);
    }).catch((error: any) => {
      this.statusCode = error.status;
      let responseText: string = error.statusText;
      if (isNotNullOrUndefined(error.data) && isObject(error.data)) {
        responseText = JSON.stringify(error.data, null, "\t");
      }
      this.editor.setValue(responseText);
    });
  }

  executionActionHelper(): ng.IPromise<any> {
    let response: ng.IPromise<any>;
    switch (this.name) {
      case "SEARCH":
        response = this.restService.executeCacheQuery(this.cacheName, this.inputParams[1]);
        break;
      case "POST":
        response = this.restService.executeCachePost(this.cacheName, this.inputParams[0], this.inputParams[1]);
        break;
      case "PUT":
        response = this.restService.executeCachePut(this.cacheName, this.inputParams[0], this.inputParams[1]);
        break;
      case "GET":
        response = this.restService.executeCacheGet(this.cacheName, this.inputParams[0]);
        break;
      case "DELETE":
        response = this.restService.executeCacheDeleteKey(this.cacheName, this.inputParams[0]);
        break;
      default:
        console.error("Unknown request type " + this.name);
    }
    return response;
  }

  $postLink(): void {
    this.$timeout(() => {
      let area: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById(this.name + "-response-text-area");
      let editorConfig: EditorConfiguration = <EditorConfiguration> {
        lineNumbers: true,
        mode: {
          name: "javascript",
          json: true
        },
        readOnly: true
      };
      this.editor = CodeMirror.fromTextArea(area, editorConfig);
    }, 200);
  };

  getTemplateUrl(): string {
    return "components/query-panel/view/" + this.panelType + "-panel.html";
  }

}
