import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { TuiCheckbox } from "@taiga-ui/kit";

@Component({
selector: 'uh-list-item',
  imports: [CommonModule,ReactiveFormsModule,
    TuiCheckbox
  ],
  template: `	
    <div id="list-item-container">
        <div id="checkbox-container">
            <input
                tuiCheckbox
                type="checkbox"
                [formControl]="formControl"
                (click)="toggle()"
            />
        </div>
        <div id="content-outlet">
            <ng-content/>
        </div>
    </div>
  `,
  styles: `
    #list-item-container { display: flex; }
    #checkbox-container { margin: auto 0; }
    #content-outlet { flex-grow: 1; padding: 5px 10px; }
    `
})
export class GenericListItem<T> {
    protected _is_selected: boolean = false;
    private _index: number = -1;
    toggled = output<boolean>();
    item_value = input<T>();
    protected formControl = new FormControl(false);

    constructor() {

    }

    public toggle() {
        console.log('toggle')
        this._is_selected = ! this._is_selected;
        this.formControl.setValue(this._is_selected);
        this.toggled.emit(this._is_selected);
    }

    /** Update index to the desired location in a list */
    public set set_index(idx: number) {
        this._index = idx;
    }

    public get index() { return this._index; }

    public get value() { return this.item_value }
}