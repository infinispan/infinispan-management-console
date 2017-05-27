export class SniModalCtrl {
  public hostName: string;
  public securityRealm: string;
  public sniName: string;

  static $injector: string[] = ['$scope'];
  constructor(public $scope: any) {
    console.log('SNI');
  }

  public saveSni() {
    this.$scope.$close({
      name: this.sniName,
      hostName: this.hostName,
      securityRealm: this.securityRealm
    })
  }
}
