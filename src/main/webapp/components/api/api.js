'use strict';
/**
 * This module encapsulates calls to infinispan API.
 * Main service in this module is api.
 */
angular.module('managementConsole.api', [
  'ispn.directives.slider',
  'ispn.directives.cache.cacheconfiguration',
  'ispn.directives.cache.configurationsection',
  'ispn.directives.cache.jdbcstore',
  'ispn.directives.cache.security',
  'ispn.directives.cache.general',
  'ispn.directives.cache.generaldist',
  'ispn.directives.cache.generalreplicated',
  'ispn.directives.cache.generalinvalidation',
  'ispn.directives.cache.generallocal'
]);
