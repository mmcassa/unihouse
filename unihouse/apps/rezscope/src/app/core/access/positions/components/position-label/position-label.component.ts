import { Component, input } from '@angular/core';
import { AbstractPositionDetail } from '../../abstract-position';
import { TuiAutoColorPipe, TuiLink, TuiSizeXS } from '@taiga-ui/core';
import { TuiBadge, TuiChip, TuiStatus } from '@taiga-ui/kit';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-position-label',
  imports: [
    CommonModule,
    TuiChip,
    TuiAutoColorPipe,
    TuiLink,
    TuiStatus,
    TuiBadge,
  ],
  templateUrl: './position-label.component.html',
  styleUrl: './position-label.component.scss'
})
export class PositionLabelComponent extends AbstractPositionDetail {
  size = input<TuiSizeXS>('xs');
  link = input<boolean>(true);
  department = input<boolean>(true);
  status = input<boolean>(false);
}
