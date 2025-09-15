import { Component, inject, input, OnInit } from '@angular/core';
import { EmploymentPositionInterface } from './position.interface';
import { PositionService } from './position.service';

@Component({ template: '', standalone: true })
export class AbstractPositionDetail implements OnInit {
  protected readonly positionService = inject(PositionService);
  
  id = input<number|EmploymentPositionInterface|undefined>(-1);

  protected position?: EmploymentPositionInterface;
  protected loading: boolean = false;

  ngOnInit() {
    this.fetch_position();
  }

  protected fetch_position() {
    const id = this.id();
    if (id != null)
      if (typeof id !== 'number') {
        this.position = id;
      } else if ( id > -1) {
      this.loading = true;
      this.positionService.get_position(id).subscribe({
        next: p => {
          this.position = p;
          this.loading = false;
        }, error: err => {
          this.loading = false;
        }
      })
    } else {
      
    }
  }

  protected open_drawer() {
    if (this.position)
      this.positionService.open_position_drawer(this.position);
  }


}
