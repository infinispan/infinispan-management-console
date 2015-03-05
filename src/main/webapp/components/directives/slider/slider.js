(function () {
  'use strict';

  var module = angular.module('ispn.directives.slider', ['ispn.services.utils']);

  module.directive('slider', ['utils', function (utils) {
      return {
        restrict: 'E',
        scope: {
          min: '=',
          max: '=',
          unit: '=',
          step: '@',
          value: '=',
          from: '=',
          to: '='
        },
        replace: false,
        templateUrl: 'components/template/slider/slider.html',
        link: function (scope, element, attrs) {
          var fromSliderValue = null, toSliderValue = null;
          var sliderElement = $(element).find("div");
          var sliderEvent = 'slide';
          var twoValueSlider = utils.isNotNullOrUndefined(scope.from) && utils.isNotNullOrUndefined(scope.to);
          var oneValueSlider = utils.isNotNullOrUndefined(scope.value);
          if (twoValueSlider) {
            sliderElement.noUiSlider({
              start: [
                  scope.min,
                  scope.max
              ],
              step: parseFloat(scope.step || 1),
              connect: true,
              range: {
                min: [parseFloat(scope.min)],
                max: [parseFloat(scope.max)]
              }
            });

            //event callback when user touches slider
            sliderElement.on(sliderEvent, function () {
              fromSliderValue = parseFloat(sliderElement.val()[0]);
              toSliderValue = parseFloat(sliderElement.val()[1]);
              scope.$apply(function () {
                scope.from = fromSliderValue;
                scope.to = toSliderValue;
              });
            });

            //watch model for changes made by our app (e.g. clear filters)
            scope.$watch('from', function (newVal, oldVal) {
              if (newVal !== fromSliderValue) {
                return sliderElement.val([
                  newVal,
                  null
                ]);
              }
            });
            scope.$watch('to', function (newVal, oldVal) {
              if (newVal !== toSliderValue) {
                return sliderElement.val([
                  null,
                  newVal
                ]);
              }
            });
          } else if (oneValueSlider) {
            var sliderValue = null;
            sliderElement.noUiSlider({
              start: [scope.min],
              step: parseFloat(scope.step || 1),
              range: {
                min: [parseFloat(scope.min)],
                max: [parseFloat(scope.max)]
              }
            });

            //watch model for changes made by our app (e.g. clear filters)
            sliderElement.on(sliderEvent, function () {
              sliderValue = parseFloat(sliderElement.val());
              return scope.$apply(function () {
                scope.value = sliderValue;
              });
            });
            scope.$watch('value', function (newVal, oldVal) {
              if (newVal !== sliderValue) {
                return sliderElement.val(newVal);
              }
            });
          }
        }
      };
    }
  ]);
}());
