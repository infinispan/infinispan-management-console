import CodeMirror = require("codemirror");
import {RestService} from "../../services/rest/RestService";
import {EditorConfiguration} from "codemirror";
import {isNotNullOrUndefined, isObject, isEmptyString} from "../../common/utils/Utils";

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
    this.executionActionHelper(this.name, this.inputParams[0], this.inputParams[1]).then((response: any) => {
      this.statusCode = 200;
      if (isNotNullOrUndefined(response) && isNotNullOrUndefined(response.data)) {
        if (isObject(response.data)) {
          this.editor.setValue(JSON.stringify(response.data, null, "\t"));
        } else {
          this.editor.setValue("Request executed successfully. No response returned.");
        }
      }
    }).catch((error: any) => {
      this.statusCode = 401;
      if (isEmptyString(error)) {
        this.editor.setValue("Error response with no further details returned");
      } else {
        this.editor.setValue(JSON.stringify(error, null, "\t"));
      }
    });
  }

  executionActionHelper(type: string, param1: string, param2: any): ng.IPromise<any> {
    let response: ng.IPromise<any>;
    switch (type) {
      case "SEARCH":
        response = this.restService.executeCacheQuery(this.cacheName, param2);
        break;
      case "POST":
        response = this.restService.executeCachePost(this.cacheName, param1, param2);
        break;
      case "PUT":
        response = this.restService.executeCachePut(this.cacheName, param1, param2);
        break;
      case "GET":
        response = this.restService.executeCacheGet(this.cacheName, param1);
        break;
      case "DELETE":
        response = this.restService.executeCacheDeleteKey(this.cacheName, param1);
        break;
      default:
        console.log("Unknown request type " + type);
    }
    return response;
  }

  $postLink(): void {
    this.$timeout(() => {
      let area: HTMLTextAreaElement = <HTMLTextAreaElement>document.getElementById(this.name + "-response-text-area");
      console.log("after timeout " + area + " for " + this.name);
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
