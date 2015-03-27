'use strict';

angular.module('managementConsole.filters', [])
    .filter('customPropertyFilter', function (){
        function parseString(input){
            return input.split(".");
        }
        function getValue(element, propertyArray){
            var value = element;
            _.forEach(propertyArray, function(property){
                value = value[property];
            });
            return value;
        }
        return function (array, propertyString, target){
            var properties = parseString(propertyString);
            return _.filter(array, function(item){
                if (target == null) {
                    // nothing in filter/search field yet -- show everything
                    return true;
                } else {
                    return getValue(item, properties).indexOf(target) > -1;
                }
            });
        }
    });
