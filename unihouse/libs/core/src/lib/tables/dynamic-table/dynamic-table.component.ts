import { AfterContentInit, Component, ContentChildren, input, OnChanges, OnInit, output, QueryList, SimpleChanges, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiTable, TuiTableSortPipe } from '@taiga-ui/addon-table';
import { TuiSizeL, TuiSizeM, TuiSizeS } from '@taiga-ui/core';
import { TuiCheckbox } from '@taiga-ui/kit';
import { TableColumn, TableColumnOption, TableItem } from "../generic-table";
import { CommonModule } from '@angular/common';
import { NamedTemplateDirective } from '../../directives/named-template.directive';



@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TuiTable,
    TuiTableSortPipe,
    TuiCheckbox
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent<T extends Record<any,any>> implements OnInit,OnChanges, AfterContentInit {
  @ContentChildren(NamedTemplateDirective) templates!: QueryList<NamedTemplateDirective>;

  data = input<TableItem<T>[],T[]>([],{
    transform: (i) => {
      return i.map(x => {
        return {
          selected: false, 
          item: x,

        } as TableItem<T>
      });
    }
  });
  columns  = input<TableColumnOption[],(TableColumnOption|string)[]>([],
    {
      transform: (v) => {
        return v.map(i => {
          if (typeof i === 'string') {
            return {
              title: i,
              property: i,
            } as TableColumnOption
          } else {
            return i
          }
        })
      }
    }
  );
  selectable = input<boolean>(false);
  selected = output<T[]>();
  size = input<TuiSizeM | TuiSizeS>("s");

  protected show_loading: boolean = false;
  protected timeout?:any;
  
  protected _columns: TableColumn[] =[new TableColumn('',0,'$_selected')];
  protected _select_all: boolean = false;
  protected templateMap: Record<string, TemplateRef<any>> = {};

  constructor() {}

  ngOnInit() {
      this.build_columns();
  }

  ngAfterContentInit() {
    for (const directive of this.templates) {
      this.templateMap[directive.name] = directive.template;
    }

  }

  protected get flat_columns(): string[] {
    return this._columns.map(x => x.property);
  }

  data_updated() {
    if (this.show_loading) {
      clearTimeout(this.timeout);

    } else {
      this.show_loading = true;
    }
    this.timeout = setTimeout(() => {
      this.show_loading = false;
    }, 700);
  }

  build_columns() {
    const cols = []
      if (this.selectable()) {
        cols.push(new TableColumn('',0,'$_selected'))
      }
      cols.push(...this.columns().map(
          (x,i) => { 
            return new TableColumn(x.title,x.order ?? i,x.property)
          }
      ));
      this._columns = cols;
  }

  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.data_updated();
    }
    // if (Object.keys(changes).includes("_select_all")) {
    // }
  }

  protected get columnList(): string[] { 
    return this._columns.map(c => {return c.title})
  };

  protected select_all() {
    this.data().forEach(x => x.selected = ! this._select_all);
    this.emit_selected();
  }

  protected upd_selected(item: TableItem<T>) {
    item.selected = !item.selected;
    if (!item.selected && this._select_all ) {
      this._select_all = false;
    }
    this.emit_selected();
  }

  

  private emit_selected() {
    this.selected.emit(
      this.data()
      .map(x => { return x.selected ? x.item : null})
      .filter(x => x != null)
    );
  }

}
