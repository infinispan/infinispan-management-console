export class SniModalCtrl {
  public hostName: string;
  public securityRealm: string;
  public sniName: string;

  static $injector: string[] = ['$scope'];
  constructor(public $scope: any) {
    console.log('SNI');
  }

  public saveSni() {
    console.log({
      name: this.sniName,
      hostName: this.hostName,
      securityRealm: this.securityRealm
    })
    this.$scope.$close({
      hostName: this.hostName,
      securityRealm: this.securityRealm
    })
  }
}