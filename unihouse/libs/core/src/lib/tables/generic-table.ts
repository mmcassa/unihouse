import { input, output } from "@angular/core";
import { TuiSizeL, TuiSizeS } from "@taiga-ui/core";

export interface TableColumnOption {
  title: string;
  property?: string;
  order?: number;
}

export interface TableItem<T> {
    selected?: boolean;
    item: T;
    [x: string]: unknown;
}

export class TableColumn {
  private _title: string;
  private _dataProperty: string;
  private _order: number;
  private _hidden: boolean = false;

  constructor(title:string,order: number,property?:string) {
    this._title = title;
    this._order = order;
    this._dataProperty = property || title;
  }

  get order() { return this._order; }
  get property() { return this._dataProperty; }
  get title() { return this._title; }
}