// see https://github.com/Sixthdim/angular-vertilize
import IAugmentedJQuery = angular.IAugmentedJQuery;
import IScope = angular.IScope;
import IAttributes = angular.IAttributes;
import IDirective = angular.IDirective;
import IDirectiveFactory = angular.IDirectiveFactory;
import {VertilizeContainerDirective} from "./VertilizeContainerDirective";

export class VertilizeDirective implements IDirective {

  restrict: string = "EA";
  require: string = "^vertilizeContainer";

  public static factory(): IDirectiveFactory {
    let directive: IDirectiveFactory = () => {
      return new VertilizeDirective();
    };
    return directive;
  }

  public link: Function = (scope: IScope, element: IAugmentedJQuery, attrs: IAttributes, parent: VertilizeContainerDirective) => {
    // My index allocation
    let myIndex: number = parent.allocateMe();
    // Watch my height
    scope.$watch(() => {
      let clone: JQuery = element.clone()
        .removeAttr("vertilize")
        .css({
          height: "",
          width: element.outerWidth(),
          position: "fixed",
          top: 0,
          left: 0,
          visibility: "hidden"
        });
      element.after(clone);
      var realHeight: number = clone.height();
      clone.remove();
      return realHeight;
    }, (myNewHeight, myOldHeight) => {
      if (myNewHeight) {
        parent.updateMyHeight(myIndex, myNewHeight);
      }
    });

    // Watch for tallest height change
    scope.$watch(() => {
      return parent.getTallestHeight();
    }, (tallestHeight, oldValue) => {
      if (tallestHeight) {
        element.css("height", tallestHeight);
      }
    });

  };
}

