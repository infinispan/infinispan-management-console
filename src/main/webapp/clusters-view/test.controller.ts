import {App} from "../App";

// TODO when we re-work controller as Typescript objects we should not register to module, but just export class
const module: ng.IModule = App.module("managementConsole", []);
module.controller("TestCtrl", function () {

});
