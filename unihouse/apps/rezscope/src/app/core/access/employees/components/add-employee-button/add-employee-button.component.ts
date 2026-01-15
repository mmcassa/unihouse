import { Component, inject } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { AddEmployeeComponent } from '../add-employee/add-employee.component';
import { DialogService } from '@unihouse/core';

@Component({
  selector: 'app-add-employee-button',
  imports: [
    TuiButton
  ],
  templateUrl: './add-employee-button.component.html',
  styleUrl: './add-employee-button.component.scss'
})
export class AddEmployeeButtonComponent {
  private dialog = inject(DialogService);

  protected on_click() {
    this.dialog.openDialog(
      AddEmployeeComponent,'New Employee',null,'l',true
    ).subscribe()
  }

}
