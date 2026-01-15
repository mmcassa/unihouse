import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb.service';
import { RouterModule } from '@angular/router';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [RouterModule,TuiIcon, TuiButton],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  breadcrumbs: Array<{ label: string, url: string }> = [];

  constructor(private breadcrumbService: BreadcrumbService,private _location: Location) {}

  ngOnInit(): void {
    this.breadcrumbService.breadcrumbs.subscribe({next: bc => {this.breadcrumbs = bc} });
  }

  goBack(): void {
    this._location.back();
  }
}