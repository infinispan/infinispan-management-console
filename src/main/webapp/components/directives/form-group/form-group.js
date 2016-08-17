(function () {
    'use strict';
    var module = angular.module('ispn.directives.formgroup', ['ispn.services.utils']);
    module.directive('formGroup', ['utils', function (utils) {
            return {
                restrict: 'E',
                scope: {
                    data: '=',
                    field: '@',
                    label: '@',
                    meta: '=',
                    previousValue: '=',
                    placeholder: '@',
                    readOnly: '=',
                    optionString: '@',
                    optionValues: '=',
                    changeCallback: '=',
                    undoCallback: '='
                },
                replace: true,
                templateUrl: 'components/directives/form-group/form-group.html',
                link: function (scope) {
                    scope.init = function () {
                        if (utils.isNullOrUndefined(scope.optionString)) {
                            scope.type = utils.getTypeModelType(scope.meta);
                            scope.multiValue = scope.isMultiValue();
                            scope.option = 'item as item for item in meta.allowed';
                        }
                        else {
                            scope.multiValue = true;
                            scope.option = scope.optionString.concat(' in optionValues');
                        }
                    };
                    scope.fieldValueModified = function () {
                        var original = scope.previousValue;
                        var latest = scope.data[scope.field];
                        if (latest === original || latest == original ||
                            (utils.isBoolean(latest) && !latest && utils.isNullOrUndefined(original)) ||
                            (!latest && utils.isNullOrUndefined(original))) {
                            utils.makeFieldClean(scope.meta, scope.field, true, scope);
                        }
                        else {
                            utils.makeFieldDirty(scope.meta, scope.field, true, scope);
                        }
                        if (utils.isNotNullOrUndefined(scope.changeCallback)) {
                            scope.changeCallback(); // Execute passed function
                        }
                    };
                    scope.getStyle = function () {
                        var hasField = utils.has(scope.meta, 'style');
                        return hasField ? scope.meta.style : '';
                    };
                    scope.isMultiValue = function () {
                        var hasField = utils.has(scope.meta, 'allowed');
                        return hasField ? utils.isNotNullOrUndefined(scope.meta.allowed) : false;
                    };
                    scope.resolveFieldName = function () {
                        if (utils.isNotNullOrUndefined(scope.label)) {
                            return scope.label;
                        }
                        return utils.convertCacheAttributeIntoFieldName(scope.field);
                    };
                    // Remove these when properties directive has been created!
                    scope.createOrUpdateProperty = function (field, key, value) {
                        scope.data[field] = scope.data[field] || {};
                        scope.data[field][key] = value;
                        scope.fieldValueModified(field);
                    };
                    scope.removeProperty = function (field, key) {
                        delete scope.data[field][key];
                        scope.fieldValueModified(field);
                    };
                    scope.init();
                }
            };
        }]);
    module.directive('fieldInfo', ['utils', function (utils) {
            return {
                restrict: 'E',
                scope: {
                    data: '=',
                    meta: '=',
                    field: '@',
                    previousValue: '=',
                    readOnly: '=',
                    undoCallback: '='
                },
                replace: true,
                templateUrl: 'components/directives/form-group/field-info.html',
                link: function (scope) {
                    scope.isFieldValueModified = function () {
                        return utils.isFieldValueModified(scope.meta);
                    };
                    scope.undoFieldChange = function () {
                        scope.data[scope.field] = angular.copy(scope.previousValue);
                        utils.makeFieldClean(scope.meta);
                        var typeModelValue = utils.deepGet(scope.meta, 'type.TYPE_MODEL_VALUE');
                        if (utils.isNotNullOrUndefined(typeModelValue) && typeModelValue === 'OBJECT') {
                            utils.makeAllFieldsClean(scope.meta);
                        }
                        if (utils.isNotNullOrUndefined(scope.undoCallback)) {
                            scope.undoCallback();
                        }
                    };
                    scope.fieldChangeRequiresRestart = function () {
                        return utils.fieldChangeRequiresRestart(scope.meta);
                    };
                }
            };
        }]);
}());
//# sourceMappingURL=form-group.js.map