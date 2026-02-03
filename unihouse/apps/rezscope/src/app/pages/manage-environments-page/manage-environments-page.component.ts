import { Component, inject } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { ExtEnvironmentService } from '@unihouse/core';
import { EnvironmentListComponent } from '@unihouse/core';

@Component({
  selector: 'app-manage-environments-page',
  standalone: true,
  imports: [
    EnvironmentListComponent,
    TuiButton
  ],
  templateUrl: './manage-environments-page.component.html',
  styleUrl: './manage-environments-page.component.scss'
})
export class ManageEnvironmentsPageComponent {
  environmentService = inject(ExtEnvironmentService);

  open_new_env() {
    this.environmentService.open_add_environment_form().subscribe({
      next: res => {
        
      }
    })
  }

}
