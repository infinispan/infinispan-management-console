// see http://blog.aaronholmes.net/writing-angularjs-directives-as-typescript-classes
// and https://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
import {IParseService} from "angular";
import ICompiledExpression = angular.ICompiledExpression;
import IAugmentedJQuery = angular.IAugmentedJQuery;
import IScope = angular.IScope;
import IAttributes = angular.IAttributes;
import IDirective = angular.IDirective;
import IDirectiveFactory = angular.IDirectiveFactory;

export class FileModelDirective implements IDirective {

  static $inject: string[] = ["$parse"];
  restrict: string = "A";

  public static factory(): IDirectiveFactory {
    let directive: IDirectiveFactory = ($parse: IParseService) => {
      return new FileModelDirective($parse);
    };
    return directive;
  }

  constructor(private $parse: IParseService) {
  }

  public link: Function = (scope: IScope, element: IAugmentedJQuery, attrs: IAttributes) => {
    /*handle all your linking requirements here*/
    let model: ICompiledExpression = this.$parse(attrs["fileModel"]);
    let modelSetter: any = model.assign;

    element.bind("change", () => {
      scope.$apply(() => {
        let files: IAugmentedJQuery = element.find("files");
        modelSetter(scope, files.context["files"][0]);
      });
    });
  };
}

