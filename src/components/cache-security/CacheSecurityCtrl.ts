import {IConfigurationCallback} from "../../common/configuration/IConfigurationCallback";
import {isNotNullOrUndefined, isNullOrUndefined, isArray, deepSet, deepGet} from "../../common/utils/Utils";
import {ICacheContainer} from "../../services/container/ICacheContainer";
import {makeFieldClean, fieldChangeRequiresRestart, isFieldValueModified} from "../../common/configuration/ConfigUtil";
import {IRole} from "../../services/security/IRole";

export class CacheSecurityCtrl implements IConfigurationCallback {

  static $inject: string[] = ["containerService"];

  data: any;
  auth: any;
  container: ICacheContainer;
  meta: any;
  initDefaults: boolean;
  readOnly: boolean;
  configCallbacks: IConfigurationCallback[];

  containerRoles: IRole[];
  fields: string[];
  prevData: any;

  constructor() {
    if (this.isSecurityDefinedForContainer()) {
      if (isNotNullOrUndefined(this.configCallbacks)) {
        this.configCallbacks.push(this);
      }

      if (isNullOrUndefined(this.data)) {
        this.data = {};
        deepSet(this.data, "authorization.AUTHORIZATION", {
          "is-new-node": true,
          roles: [],
          enabled: false
        });
      }

      this.prevData = [];
      this.fields = ["enabled", "roles"];
      this.auth = this.data.authorization.AUTHORIZATION;
      this.auth.roles = isNullOrUndefined(this.auth.roles) ? [] : this.auth.roles;
      this.containerRoles = this.container.authorization.roles;
      this.cleanMetadata();
    }
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
      this.prevData[field] = isNotNullOrUndefined(this.auth[field]) ? angular.copy(this.auth[field]) : "";
    });
  }

  isSecurityDefinedForContainer(): boolean {
    return isNotNullOrUndefined(this.container.authorization);
  }

  getRoleNames(): string[] {
    return this.containerRoles.filter(role => isNotNullOrUndefined(role)).map(role => role.name);
  }

  toggleSelection(role: string): void {
    let roleIndex: number = this.auth.roles.indexOf(role);
    if (roleIndex > -1) { // is currently selected
      this.auth.roles.splice(roleIndex, 1);
    } else { // is newly selected
      this.auth.roles.push(role);
    }
  }

  isRoleSelected(role: string): boolean {
    return this.auth.roles.indexOf(role) > -1;
  }

  hasRolesChanged(): boolean {
    let prevRoles: string[] = isArray(this.prevData.roles) ? this.prevData.roles : [];
    if (prevRoles.length !== this.auth.roles.length) {
      return true;
    }

    let sortedPrev: string[] = angular.copy(prevRoles).sort();
    let sortedCurrent: string[] = angular.copy(this.auth.roles).sort();
    return !sortedPrev.every((role, index) => role === sortedCurrent[index]);
  }
}
