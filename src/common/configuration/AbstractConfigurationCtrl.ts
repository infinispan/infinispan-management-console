import {IConfigurationCallback} from "./IConfigurationCallback";

export abstract class AbstractConfigurationCtrl {

  callbackArray: IConfigurationCallback[] = [];

  isRestartRequired(): boolean {
    return this.callbackArray.some(controller => controller.isRestartRequired());
  }

  isAnyFieldModified(): boolean {
    return this.callbackArray.some(controller => controller.isAnyFieldModified());
  }

  cleanMetaData(): void {
    this.callbackArray.forEach(controller => controller.cleanMetadata());
  }
}
