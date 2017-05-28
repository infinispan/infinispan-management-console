export class NewSniComponent {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      addAction: '&',
      parent: '<'
    };
    this.controller = function() {
      this.hostName = '';
      this.securityRealm = '';
      this.name = '';
      this.addSni = () => {
        this.addAction({
          $event: {
            name: this.name,
            hostName: this.hostName, 
            securityRealm: this.securityRealm,
            parent: this.parent
          }
        });
        this.hostName = '';
        this.securityRealm = '';
        this.name = '';
      }
    };
    this.templateUrl = 'components/endpoint-configuration/components/new-sni/new-sni.component.html';
  }
};
