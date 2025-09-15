import { Component, inject, OnInit } from '@angular/core';
import { ExtEnvironmentService, ExternalEnvironment } from '../ext-environment.service';
import { DynamicTableComponent } from '../../tables/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-environment-list',
  standalone: true,
  imports: [
    DynamicTableComponent
  ],
  templateUrl: './environment-list.component.html',
  styleUrls: ['./environment-list.component.scss']
})
export class EnvironmentListComponent implements OnInit {
  private readonly environmentService = inject(ExtEnvironmentService);
  
  environments: ExternalEnvironment[] = [];
  columns: string[] = ['id','name','url','type','prod'];

  constructor() {}

  ngOnInit(): void {
    this.environmentService.getExternalEnvironments().subscribe(data => {
      this.environments = data;
    });
  }
}
