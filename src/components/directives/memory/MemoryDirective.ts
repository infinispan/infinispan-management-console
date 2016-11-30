import IAugmentedJQuery = angular.IAugmentedJQuery;
import IAttributes = angular.IAttributes;
import IDirective = angular.IDirective;
import IDirectiveFactory = angular.IDirectiveFactory;
import {MemoryChart} from "./MemoryChart";
import {MemoryData} from "../../memory/MemoryData";

export interface IMemoryScope extends ng.IScope {
  data: MemoryData;
  chartId: string;
  title: string;
}

export class MemoryDirective implements IDirective {
  static $inject: string[] = ["$parse"];

  public templateUrl: string = "components/directives/memory/view/memory.html";
  public restrict: string = "E";
  public scope: {[key: string]: string} = {
    "data": "=",
    "chartId": "@",
    "title": "@"
  };
  public controller: Function = MemoryDirective;

  public static factory(): IDirectiveFactory {
    let directive: IDirectiveFactory = () => {
      return new MemoryDirective();
    };
    return directive;
  }

  public link: Function = (scope: IMemoryScope, element: IAugmentedJQuery, attrs: IAttributes) => {
    scope.$watch("data", (newVal) => {
      if (newVal) {
        let chart: MemoryChart = new MemoryChart("#" + scope.chartId, scope.data);
        chart.redraw();
      }
    }, true);
  };
}

