export class SniViewComponent {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      sni: '<'
    };
    this.controller = function() {
    };
    this.templateUrl = 'components/endpoint-configuration/components/sni-view.component.html';
  }
};
