import { Component, inject } from '@angular/core';
import { PaginationWrapperComponent, PaginationOptions, TableColumnOption } from '@unihouse/core';
import { PositionTableComponent, PositionFiltersComponent, PositionService } from 'apps/rezscope/src/app/core/access';
import { EmploymentPositionInterface } from 'apps/rezscope/src/app/core/access/positions/position.interface';

@Component({
  selector: 'app-positions-list',
  standalone: true,
  imports: [
    PaginationWrapperComponent,
    PositionTableComponent,
    PositionFiltersComponent,
  ],
  templateUrl: './positions-list.component.html',
  styleUrl: './positions-list.component.scss'
})
export class PositionsListComponent {
  private readonly positionService = inject(PositionService);
  protected paging: PaginationOptions = {
    page: 0,
    page_size: 25,
    total_items: 0,
    total_pages: 1
  }

  protected columns: TableColumnOption[] = [
    { title: "Title", property: "name", order: 0 },
    { title: "Description", property: "details", order: 1 },
    { title: "Members", property: "member_count", order: 2 },
    { title: "Type", property: "type", order: 3 },
  ];

  protected data: EmploymentPositionInterface[] = [];

  constructor() {
    this.fetch_data();
  }

  protected fetch_data(filters:any=null) {
    this.positionService.get_positions(filters,this.paging)
      .subscribe({
          next: d => { this.data = d; },
          error: err => {
            console.error('Failed to load position data');
          }
        }
      );
  }
}