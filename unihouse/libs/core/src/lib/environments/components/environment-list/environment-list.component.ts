import { Component, inject, OnInit } from '@angular/core';
import { ExternalEnvironment } from '../../interfaces/environment-interface';
import { ExtEnvironmentService } from '../../ext-environment.service';
import { DynamicTableComponent } from '../../../tables/dynamic-table/dynamic-table.component';
import { TableColumnOption } from '../../../tables';
import { NamedTemplateDirective } from '../../../directives';
import { TuiBadge } from '@taiga-ui/kit';
import { EnvironmentTypePipe } from '../../pipes/environment-type-pipe';
import { TuiButton, TuiHint } from '@taiga-ui/core';

@Component({
  selector: 'app-environment-list',
  standalone: true,
  imports: [
    DynamicTableComponent,
    NamedTemplateDirective,
    TuiBadge,
    EnvironmentTypePipe,
    TuiButton,
    TuiHint
  ],
  templateUrl: './environment-list.component.html',
  styleUrls: ['./environment-list.component.scss']
})
export class EnvironmentListComponent implements OnInit {
  private readonly environmentService = inject(ExtEnvironmentService);
  
  environments: ExternalEnvironment[] = [];
  columns: (string|TableColumnOption)[] = [
    'id',
    {title: 'Environment', property: 'name'},
    {title: 'Type', property: 'type'},
    {title: 'URL',property: 'url'},
    {title: 'Actions',property: 'actions'},
  ];

  constructor() {}

  ngOnInit(): void {
    this.refresh()
  }

  refresh() {
this.environmentService.getExternalEnvironments().subscribe(data => {
      this.environments = data;
    });
  }

  open_create_auth(env:ExternalEnvironment) {
    this.environmentService.open_environment_auth_create_form(env).subscribe({
      next: (res) => {
        this.refresh()
      }
    })
  }
}
