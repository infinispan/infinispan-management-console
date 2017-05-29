export class PrefixListComponent {

  bindings: any;
  controller: any;
  templateUrl: string;

  constructor() {
    this.bindings = {
      addAction: '&',
      removeAction: '&',
      parent: '<',
      listId: '@'
    };
    this.controller = function() {
      this.add = ($event) => {
          this.addAction({
            $event: $event
          });
      };
      this.remove = (action, item) => {
        this.removeAction({
          $event: {
            parent: this.parent,
            item: item,
            path: this.listId
          }
        });
      };
      this.actions = [
        {
          name: 'Remove',
          class: 'btn btn-danger',
          title: 'Remove node',
          actionFn: this.remove
        }
      ];
    };
    this.templateUrl = 'components/endpoint-configuration/components/prefix-list/prefix-list.component.html';
  }
};
