import { Component, inject, input, OnInit } from '@angular/core';
import { TuiHint, TuiLink, TuiSizeL, TuiSizeS } from '@taiga-ui/core';
import { EmployeeInterface } from '../../employee';
import { TuiBadge } from '@taiga-ui/kit';
import { PositionLabelComponent } from '../../../positions/components/position-label/position-label.component';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../employee.service';
import { NameAvatarComponent } from '@unihouse/core';

@Component({
  selector: 'app-employee-label',
  imports: [
    CommonModule,
    NameAvatarComponent,
    TuiBadge,
    TuiHint,
    TuiLink,
    PositionLabelComponent,
  ],
  templateUrl: './employee-label.component.html',
  styleUrl: './employee-label.component.scss'
})
export class EmployeeLabelComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  
  size = input<TuiSizeL|TuiSizeS>('m');
  employee = input<number|EmployeeInterface>();
  secuserid = input<number>();
  link = input<boolean>(true);
  status = input<boolean>(true);
  hint = input<boolean>(true);
  
  protected _employee!: EmployeeInterface;
  


  ngOnInit(): void {
    this.set_employee();
  }
  
  private set_employee() {
    let id: number;
    const e = this.employee();
    const su = this.secuserid();
    if (e !== undefined) {
      if (typeof e === 'number') {
        if (e === -1) return;
          this.employeeService.get_employee(e).subscribe({
            next: x => {this._employee = x}
          });
      } else {
        this._employee = e;
        return;
      }
    } else if (su) {
      this.employeeService.get_employee_by_secuserid(su).subscribe({
            next: x => {this._employee = x}
          });
    } else {
      return;
    }
  }

  protected open_drawer() {
    this.employeeService.open_employee_drawer(this._employee);
  }
}
