import { Component } from '@angular/core';
import { TuiAutoColorPipe, TuiLoader } from '@taiga-ui/core';
import { TuiChip } from '@taiga-ui/kit';
import { AbstractPositionDetail } from '../../abstract-position';

@Component({
  selector: 'app-position-chip',
  imports: [
    TuiChip,
    TuiAutoColorPipe,
    TuiLoader
  ],
  templateUrl: './position-chip.component.html',
  styleUrl: './position-chip.component.scss'
})
export class PositionChipComponent extends AbstractPositionDetail {

}
