// import IScope = angular.IScope;
import IModalScope = angular.ui.bootstrap.IModalScope;
export interface IDeployPageScope extends IModalScope {
  fileToUpload: File;
}
