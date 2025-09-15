import { Component, inject, TemplateRef } from '@angular/core';
import { TuiButton, TuiDialogContext, TuiDialogService } from '@taiga-ui/core';

import {injectContext} from '@taiga-ui/polymorpheus';

export interface ApproveDialogInput {
  title?: string;
  subtitle?: string;
  details?: string;
  true_text?: string;
  false_text?: string;
}

@Component({
  selector: 'app-approve-dialog',
  standalone: true,
  imports: [TuiButton],
  templateUrl: './approve-dialog.component.html',
  styleUrl: './approve-dialog.component.scss'
})
export class ApproveDialogComponent {
  private readonly dialogs = inject(TuiDialogService);
  public readonly context = injectContext<TuiDialogContext<boolean, ApproveDialogInput|null>>();

  protected get title(): string {
    return this.context.data && this.context.data.title !== undefined ? 
      this.context.data.title : 'Approval Requested';
  }

  protected get subtitle(): string {
    return this.context.data && this.context.data.subtitle !== undefined ? 
      this.context.data.subtitle : '';
  }

  protected get details(): string {
    return this.context.data && this.context.data.details !== undefined ? 
      this.context.data.details : 'Please make a selection.';
  }

  protected get yes_string(): string {
    return this.context.data && this.context.data.true_text !== undefined ? 
      this.context.data.true_text : 'Yes';
  }

  protected get no_string(): string {
    return this.context.data && this.context.data.false_text !== undefined ? 
      this.context.data.false_text : 'No';
  }

  protected showDialog(content: TemplateRef<TuiDialogContext>): void {
    this.dialogs.open(content, {dismissible: true}).subscribe();
}

  protected submit(val: boolean): void {
    this.context.completeWith(val);
    
  }
}
