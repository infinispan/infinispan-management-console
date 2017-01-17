import IAugmentedJQuery = angular.IAugmentedJQuery;
import IAttributes = angular.IAttributes;
import IDirective = angular.IDirective;
import IDirectiveFactory = angular.IDirectiveFactory;
import {isNotNullOrUndefined, stringEndsWith, isNonEmptyString} from "../../common/utils/Utils";
import {IStateService} from "angular-ui-router";
import {IScope} from "../../common/IScopeService";

export function generateFieldId(val: string, parent?: string): string {
  let id: string = isNonEmptyString(parent) ? parent : "";
  return id + "." + val;
}

export class IdGeneratorDirective implements IDirective {

  restrict: string = "A";

  public static factory(): IDirectiveFactory {
    let directive: IDirectiveFactory = ($state: IStateService) => {
      return new IdGeneratorDirective($state);
    };
    directive.$inject = ["$state"];
    return directive;
  }

  constructor(public $state: IStateService) {
  }

  public link: Function = ($scope: IScope, element: IAugmentedJQuery, attributes: IAttributes) => {
    attributes.$observe("idGenerator", () => {
      element.attr("id", this.generateId(attributes));
    });
  };

  private generateId(attributes: IAttributes): string {
    let id: string = this.$state.current.name + ".";

    for (let att of ["idGenerator", "type", "value"]) {
      if (isNotNullOrUndefined(attributes[att])) {
        id += attributes[att] + ".";
      }
    }

    if (stringEndsWith(id, ".")) {
      id = id.slice(0, -1);
    }
    return id.replace(/ /g, "_").toLowerCase();
  }
}

