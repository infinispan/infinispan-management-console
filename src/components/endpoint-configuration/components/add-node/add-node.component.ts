export class AddNodeComponent {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      addAction: '&',
      parent: '<',
      props: '<',
      nodeId: '<',
      title: '@'
    };
    this.controller = function() {
      this.newItem = {};

      this.add = () => {
        this.addAction({
          $event: {
            newItem: this.newItem,
            parent: this.parent
          }
        });
        this.newItem = {};
      }
    };
    this.templateUrl = 'components/endpoint-configuration/components/add-node/add-node.component.html';
  }
};
