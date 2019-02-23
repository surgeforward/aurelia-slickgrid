import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, bindable } from 'aurelia-framework';

@autoinject()
export class EditorAbsSelect {
  @bindable selectedItem: any;
  selectedId: string;
  collection; // this will be filled by the collection of your column definition

  constructor(private ea: EventAggregator) {
    console.log(ea)
  }

  selectedItemChanged(newItem) {
    console.log(newItem)
    this.ea.publish('onAbsSelectChanged', newItem);
  }
  // onModelChanged = new Subject<any>();    // object

  // onChange(item: any) {
  //   this.selectedItem = item;
  //   this.onModelChanged.next(item);
  // }

  // focus() {
  //   // do a focus
  // }
}
