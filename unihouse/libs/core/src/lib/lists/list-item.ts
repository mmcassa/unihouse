

class GenericListItem<T> {
    private _is_selected: boolean = false;
    private _index: number = -1;
    item_value!: T;
    constructor() {

    }

    public toggle() {
        this._is_selected = ! this._is_selected;
    }

    /** Update index to the desired location in a list */
    public set set_index(idx: number) {
        this._index = idx;
    }

    public get index() { return this._index; }

    public get value() { return this.item_value }
}