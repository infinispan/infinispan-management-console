// see https://github.com/Sixthdim/angular-vertilize
import IAugmentedJQuery = angular.IAugmentedJQuery;
import IScope = angular.IScope;
import IAttributes = angular.IAttributes;
import IDirective = angular.IDirective;
import IDirectiveFactory = angular.IDirectiveFactory;
import IWindowService = angular.IWindowService;

export class VertilizeContainerDirective implements IDirective {

  static $inject: string[] = ["$window"];
  restrict: string = "EA";
  controller: Function = VertilizeContainerDirective;

  private childrenHeights: number[] = [];

  public static factory(): IDirectiveFactory {
    let directive: IDirectiveFactory = ($window: IWindowService) => {
      return new VertilizeContainerDirective($window);
    };
    return directive;
  }

  constructor(private $window: IWindowService) {
  }

  // API: Allocate child, return index for tracking.
  public allocateMe(): number {
    this.childrenHeights.push(0);
    return (this.childrenHeights.length - 1);
  }

  // API: Update a child's height
  public updateMyHeight(index: number, height: number): void {
    this.childrenHeights[index] = height;
  }

  // API: Get tallest height
  public getTallestHeight(): number {
    let height: number = 0;
    for (let i: number = 0; i < this.childrenHeights.length; i = i + 1) {
      height = Math.max(height, this.childrenHeights[i]);
    }
    return height;
  }

  public link: Function = (scope: IScope, element: IAugmentedJQuery, attrs: IAttributes) => {
    // Add window resize to digest cycle
    angular.element(this.$window).bind("resize", () => {
      return scope.$apply();
    });
  };
}

