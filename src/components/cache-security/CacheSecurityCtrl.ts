import {IConfigurationCallback} from "../../common/configuration/IConfigurationCallback";
import {isNotNullOrUndefined, isNullOrUndefined, isArray} from "../../common/utils/Utils";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {makeFieldClean, fieldChangeRequiresRestart, isFieldValueModified} from "../../common/configuration/ConfigUtil";
import {IRole} from "../../services/security/IRole";

export class CacheSecurityCtrl implements IConfigurationCallback {

  static $inject: string[] = ["containerService"];

  data: any;
  container: ICacheContainer;
  meta: any;
  initDefaults: boolean;
  readOnly: boolean;
  configCallbacks: IConfigurationCallback[];

  containerRoles: IRole[];
  fields: string[];
  prevData: any;

  constructor() {
    if (isNotNullOrUndefined(this.configCallbacks)) {
      this.configCallbacks.push(this);
    }

    if (isNullOrUndefined(this.data)) {
      this.data = {
        "is-new-node": true,
        roles: []
      };
    }

    this.prevData = [];
    this.fields = ["enabled", "roles"];
    this.data.roles = isNullOrUndefined(this.data.roles) ? [] : this.data.roles;
    this.containerRoles = this.isSecurityDefinedForContainer() ? this.container.authorization.roles : [];
    this.cleanMetadata();
  }

  isAnyFieldModified(): boolean {
    return this.fields.some(field => isFieldValueModified(this.meta[field])) || this.hasRolesChanged();
  }

  isRestartRequired(): boolean {
    return this.fields.some(field => isFieldValueModified(this.meta[field]) && fieldChangeRequiresRestart(this.meta[field]));
  }

  cleanMetadata(): void {
    this.fields.forEach(field => {
      makeFieldClean(this.meta[field]);
      this.prevData[field] = isNotNullOrUndefined(this.data[field]) ? angular.copy(this.data[field]) : "";
    });
  }

  isSecurityDefinedForContainer(): boolean {
    return isNotNullOrUndefined(this.container.authorization);
  }

  getRoleNames(): string[] {
    return this.containerRoles.filter(role => isNotNullOrUndefined(role)).map(role => role.name);
  }

  toggleSelection(role: string): void {
    let roleIndex: number = this.data.roles.indexOf(role);
    if (roleIndex > -1) { // is currently selected
      this.data.roles.splice(roleIndex, 1);
    } else { // is newly selected
      this.data.roles.push(role);
    }
  }

  isRoleSelected(role: string): boolean {
    return this.data.roles.indexOf(role) > -1;
  }

  hasRolesChanged(): boolean {
    let prevRoles: string[] = isArray(this.prevData.roles) ? this.prevData.roles : [];
    if (prevRoles.length !== this.data.roles.length) {
      return true;
    }

    let sortedPrev: string[] = angular.copy(prevRoles).sort();
    let sortedCurrent: string[] = angular.copy(this.data.roles).sort();
    return !sortedPrev.every((role, index) => role === sortedCurrent[index]);
  }
}
