import { input, output } from "@angular/core";


class GenericList<T> {


    multi_select = input<boolean>(false);
    items = input<T[]>();
    _selected: T[] = [];
    selected = output<T | T[]>();

    public add_selected_item(item: T) {
        if (this.items()?.findIndex(x => {return x === item}) ) {
            throw Error('Item not in list');
        }
        if (this.multi_select() === true) {
            this._selected.push(item);
        } else {
            this._selected = [item];
        }

        this.selected.emit(this._selected);
    }

    public remove_selected_item(item: T) {
        let idx = this._selected.findIndex(x => {return x === item});
        if (idx > -1) {
            throw Error('Item not selected');
        }
        if (this.multi_select() === true) {
            this._selected.splice(idx,1);
        } else {
            this._selected = [];
        }

        this.selected.emit(this._selected);
    }
}