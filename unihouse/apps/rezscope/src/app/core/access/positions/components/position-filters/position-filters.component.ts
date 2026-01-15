import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiSearch } from '@taiga-ui/layout';
import { GenericFiltersInterface, GenericFiltersComponent } from '@unihouse/core';

interface PositionFiltersInterface extends GenericFiltersInterface {

}

@Component({
  selector: 'app-position-filters',
  imports: [
    CommonModule,
    TuiSearch,
    ReactiveFormsModule,
    TuiTextfield
  ],
  templateUrl: './position-filters.component.html',
  styleUrl: './position-filters.component.scss'
})
export class PositionFiltersComponent extends GenericFiltersComponent<PositionFiltersInterface> {

}
