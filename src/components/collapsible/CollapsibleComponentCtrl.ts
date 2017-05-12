export class CollapsibleComponentCtrl {
  public optionsOpen: boolean = false;

  public toggleOptions():void {
    this.optionsOpen = !this.optionsOpen;
  }
}
