export class NewPrefixComponent {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      addAction: '&',
      parent: '<'
    };
    this.controller = function() {
      this.name = '';
      this.addPrefix = () => {
        this.addAction({
          $event: {
            name: this.name,
            parent: this.parent
          }
        });
        this.name = '';
      }
    };
    this.templateUrl = 'components/endpoint-configuration/components/new-prefix/new-prefix.component.html';
  }
};
