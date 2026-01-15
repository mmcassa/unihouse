import { Component, input, model, output } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiChip } from '@taiga-ui/kit';
import { SecurityUserGroup } from '../../access.interface';

@Component({
  selector: 'app-securitygroup-chip-list',
  imports: [
    TuiChip,
    TuiButton
  ],
  templateUrl: './securitygroup-chip-list.component.html',
  styleUrl: './securitygroup-chip-list.component.scss'
})
export class SecuritygroupChipListComponent {
  groups = model<SecurityUserGroup[]>([] as SecurityUserGroup[]);
  removable = input<boolean>(false);
  onRemove = output<SecurityUserGroup>();
}
