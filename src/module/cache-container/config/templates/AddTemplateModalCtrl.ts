import {IStateService} from "angular-ui-router";
import {ICacheContainer} from "../../../../services/container/ICacheContainer";
import {ITemplate} from "../../../../services/container-config/ITemplate";

export class AddTemplateModalCtrl {
  static $inject: string[] = ["$state", "container", "templates"];

  newTemplateName: string;
  baseTemplate: ITemplate;
  private noBaseTemplate: ITemplate = {
    name: "<none>",
    type: "<none>"
  };

  constructor(private $state: IStateService,
              private container: ICacheContainer,
              public templates: ITemplate[]) {
    this.templates.unshift(this.noBaseTemplate);
    this.baseTemplate = this.templates[0];
  }

  createTemplate(): void {
    let params: any = {
      profileName: this.container.profile,
      containerName: this.container.name,
      templateName: this.newTemplateName
    };

    if (this.baseTemplate.name !== "<none>") {
      params.baseType = this.baseTemplate.type;
      params.baseName = this.baseTemplate.name;
    }
    this.$state.go("new-cache-template", params);
  }
}
