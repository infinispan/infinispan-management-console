import {IStateService} from "angular-ui-router";

export class AddTemplateModalCtrl {
  static $inject: string[] = ["$state", "templates"];

  newTemplateName: string = "Test Name";
  baseTemplate: string;

  constructor(private $state: IStateService,
              public templates: string[]) {
    this.templates.unshift("<none>");
    this.baseTemplate = this.templates[0];
  }

  createTemplate(): void {
    // TODO transition to create template page
  }
}
