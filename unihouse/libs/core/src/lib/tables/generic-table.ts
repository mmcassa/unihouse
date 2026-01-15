export interface TableColumnOption {
  property: string;
  title?: string;
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

  constructor(
    property:string,
    order: number,
    title?:string) {
    this._dataProperty = property;
    this._title = title || property;
    this._order = order;
  }

  get order() { return this._order; }
  get property() { return this._dataProperty; }
  get title() { return this._title; }
}