export class SniViewComponent {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      sni: '<'
    };
    this.controller = function() {
      this.$onInit = () => {
        const keys = Object.keys(this.sni);
        const sniName = keys[0] !== 'isExpanded' ? keys[0] : keys[1];
        const data = this.sni[sniName];
        console.log(sniName, data);
        this.sniName = sniName;
        this.data = data;
        console.log('aaaaaa');
      };
    };
    this.templateUrl = 'components/endpoint-configuration/components/sni-view.component.html';
  }
};
