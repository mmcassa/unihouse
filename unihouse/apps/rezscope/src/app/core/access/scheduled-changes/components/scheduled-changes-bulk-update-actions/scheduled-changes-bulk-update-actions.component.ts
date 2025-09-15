import { Component, inject } from '@angular/core';
import { TuiButton, TuiDialogContext } from '@taiga-ui/core';
import {injectContext} from '@taiga-ui/polymorpheus';
import { ScheduledChangeTypeSelectorComponent } from '../scheduled-change-type-selector/scheduled-change-type-selector.component';
import { ScheduledPositionChangeInterface } from '../../../access.interface';
import { PositionSelectorComponent } from '../../../positions';
import { StarrezAccessService } from '../../../starrez-access.service';

@Component({
  selector: 'app-scheduled-changes-bulk-update-actions',
  imports: [
    PositionSelectorComponent,
    ScheduledChangeTypeSelectorComponent,
    TuiButton
  ],
  templateUrl: './scheduled-changes-bulk-update-actions.component.html',
  styleUrl: './scheduled-changes-bulk-update-actions.component.scss'
})
export class ScheduledChangesBulkUpdateActionsComponent {
  private readonly accessService = inject(StarrezAccessService);
  private readonly context = injectContext<TuiDialogContext<boolean, ScheduledPositionChangeInterface[]|null>>();
  protected changes: Partial<ScheduledPositionChangeInterface> = {

  };

  protected get current_changes() {
    return this.context.data
  }

  get valid_change() {
    return Object.keys(this.changes).length > 0
  }


  protected submit() {
    const ids = this.current_changes.map(x => x.id);
    if (ids == null || ids.length === 0) {
      return
    }
    let fn;
    if (ids.length === 1) {
      fn = this.accessService.update_scheduled_change(
        this.current_changes[0],
        this.changes
      )
    } else {
      fn = this.accessService.update_scheduled_changes(
        ids,
        this.changes
      )
      
    }
    fn.subscribe({
      next: () => {
        this.context.completeWith(true);
      }
    })
  }
}
