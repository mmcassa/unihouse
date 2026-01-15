import { Component, inject, input } from '@angular/core';
import { SecurityUserHistory } from '../securityuser-history.interface';
import { StarrezAccessService } from '../../starrez-access.service';
import { CommonModule, DatePipe } from '@angular/common';
import { EmployeeLabelComponent } from '../../employees/components/employee-label/employee-label.component';
import { DynamicTableComponent, PaginationWrapperComponent, NamedTemplateDirective, AbstractDynamicTableManagerComponent, PaginationOptions, TableColumnOption } from '@unihouse/core';

@Component({
  selector: 'app-security-user-change-log-table',
  imports: [
    DatePipe,
    DynamicTableComponent,
    PaginationWrapperComponent,
    EmployeeLabelComponent,
    CommonModule,
    NamedTemplateDirective
  ],
  templateUrl: './security-user-change-log-table.component.html',
  styleUrl: './security-user-change-log-table.component.scss'
})
export class SecurityUserChangeLogTableComponent extends AbstractDynamicTableManagerComponent<SecurityUserHistory> {
  private readonly accessService = inject(StarrezAccessService);
  secuserid = input<number>();
  protected paging: PaginationOptions = {
    page: 0,
    page_size: 10,
    total_items: 0,
    total_pages: 1
  }

  protected ALLOWED_COLUMNS: (string|TableColumnOption)[] = [
    { title: 'Logtime',property: 'logtime'},
    { title: 'Security User ID', property :'secuserid'},
    { title: 'Change', property: 'changetype'},
    { title: 'Details', property: 'details'}
  ];

  private filters: Partial<SecurityUserHistory> = {};

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.secuserid() != null) {
      this.filters.secuserid = this.secuserid();
    } 
    this.fetch_data();
    
  }

  protected fetch_data() {
    
    this.accessService.get_security_user_history(this.filters,this.paging)
      .subscribe({
          next: d => { this.data.set(d); },
          error: err => {
            console.error('Failed to load position data');
          }
        }
      );
  }

}
