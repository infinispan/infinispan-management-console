(function () {
    'use strict';
    var module = angular.module('ispn.directives.cache.cacheconfiguration', ['ispn.services.utils']);
    module.directive('cacheConfiguration', ['utils', function (utils) {
            return {
                restrict: 'E',
                scope: {
                    data: '=',
                    metadata: '=',
                    initDefaults: '=',
                    readOnly: '=',
                    cacheType: '@',
                    outsideController: '=',
                    cluster: '='
                },
                replace: false,
                templateUrl: function (elem, attrs) {
                    return 'components/directives/cache/'.concat(attrs.cacheType).concat('.html');
                },
                link: function (scope, element, attrs) {
                    var rootMetadataObjectPath = 'children.configurations.model-description.CONFIGURATIONS.children.' + attrs.cacheType + '-configuration.model-description.*.attributes';
                    //tmp fix for ISPN-6531 until proper solution is developed
                    var authorizationOverride = {
                        enabled: {
                            description: "Enables authorization checks for a cache.",
                            default: false,
                            type: {
                                TYPE_MODEL_VALUE: 'BOOLEAN'
                            }
                        },
                        roles: {
                            description: "The list of roles which are allowed access the cache. If changing the list of roles, please specify the list of roles as JSON list e.g. [\"admin\", \"writer\"].",
                            type: {
                                TYPE_MODEL_VALUE: 'LIST'
                            }
                        }
                    };
                    if (!scope.readOnly) {
                        scope.readOnly = false;
                    }
                    if (!scope.initDefaults) {
                        scope.initDefaults = false;
                    }
                    //These three fields do not exist in DMR model so let's add them :-)
                    var metadataRoot = utils.deepGet(scope.metadata, rootMetadataObjectPath);
                    metadataRoot.name = {
                        description: 'Cache name',
                        type: {
                            TYPE_MODEL_VALUE: 'STRING'
                        }
                    };
                    metadataRoot.type = {
                        description: 'The cache configuration type',
                        allowed: ['distributed-cache', 'invalidation-cache', 'local-cache', 'replicated-cache'],
                        type: {
                            TYPE_MODEL_VALUE: 'STRING'
                        }
                    };
                    metadataRoot['template-name'] = {
                        description: 'The cache configuration template',
                        type: {
                            TYPE_MODEL_VALUE: 'STRING'
                        }
                    };
                    scope.resourceDescriptionMap = {};
                    utils.makeResourceDescriptionMap(scope.resourceDescriptionMap);
                    scope.resolveOverridenDescription = function (elementPath) {
                        if (elementPath === 'authorization') {
                            return authorizationOverride;
                        }
                        else {
                            return null;
                        }
                    };
                    scope.resolveDescription = function (elementPath) {
                        var overriden = scope.resolveOverridenDescription(elementPath);
                        if (overriden) {
                            return overriden;
                        }
                        else {
                            return utils.resolveDescription(scope.metadata, scope.resourceDescriptionMap, elementPath, scope.cacheType);
                        }
                    };
                }
            };
        }
    ]).directive('positiveInteger', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attributes, ngModel) {
                ngModel.$validators.positiveInteger = function (str) {
                    var n = ~~Number(str);
                    return String(n) === str && n >= 0;
                };
            }
        };
    });
}());
//# sourceMappingURL=configurationViewer.js.map