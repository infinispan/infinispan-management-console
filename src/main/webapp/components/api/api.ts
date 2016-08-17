import {App} from "../../App";
/**
 * This module encapsulates calls to infinispan API.
 * Main service in this module is api.
 */
angular.module('managementConsole.api', [
  'ispn.directives.matchheight',
  'ispn.directives.finishrender',
  'ispn.directives.formgroup',
  'ispn.directives.cache.cacheconfiguration',
  'ispn.directives.cache.configurationsection',
  'ispn.directives.cache.security',
  'ispn.directives.cache.cachestore',
  'ispn.directives.cache.modaldialog',
  'ispn.directives.cache.cacheLoader',
  'LocalStorageModule'
]);
