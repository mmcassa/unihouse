import { Component, input, model, output, SimpleChanges } from '@angular/core';
import { TuiPagination } from '@taiga-ui/kit';
import { PAGINATION_DEFAULT_SIZE, PaginationOptions } from '../../pagination';
import { TuiTablePagination } from '@taiga-ui/addon-table';

@Component({
  selector: 'app-pagination-wrapper',
  imports: [
    TuiPagination,
    TuiTablePagination
  ],
  templateUrl: './pagination-wrapper.component.html',
  styleUrl: './pagination-wrapper.component.scss'
})
export class PaginationWrapperComponent {
  
  public paging = model<PaginationOptions>({
    page: 0,
    page_size: PAGINATION_DEFAULT_SIZE,
    total_pages: 0,
    total_items: 0
  });
  public table = input<boolean>(true);
  public onPageChange = output<void>();

  constructor() {}

  protected goToPage(num: number) {
    this.paging().page = num;    
    this.onPageChange.emit();
  }

  protected goToPageTable(obj: any) {
    this.paging().page = obj.page;
    this.paging().page_size = obj.size;
    this.onPageChange.emit();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Object.keys(changes).includes("paging") ) {
      if (this.paging().page_size == null ) {
        this.paging().page_size = PAGINATION_DEFAULT_SIZE;
      }
    }
  }
}
