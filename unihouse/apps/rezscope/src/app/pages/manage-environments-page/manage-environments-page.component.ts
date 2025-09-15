import { Component } from '@angular/core';
import { AddEnvironmentFromComponent } from '@unihouse/core';
import { EnvironmentListComponent } from '@unihouse/core';

@Component({
  selector: 'app-manage-environments-page',
  standalone: true,
  imports: [EnvironmentListComponent,AddEnvironmentFromComponent],
  templateUrl: './manage-environments-page.component.html',
  styleUrl: './manage-environments-page.component.scss'
})
export class ManageEnvironmentsPageComponent {
  

}
