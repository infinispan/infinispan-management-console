import {App} from "../../ManagementConsole";
import {NavbarCtrl} from "./NavbarCtrl";

const module: ng.IModule = App.module("managementConsole.navbar", []);

module.controller("NavbarCtrl", NavbarCtrl);
