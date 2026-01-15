import { inject, Injectable, INJECTOR } from '@angular/core';
import { TuiDialogService, TuiDialogSize } from '@taiga-ui/core';
import {PolymorpheusComponent, PolymorpheusContent} from '@taiga-ui/polymorpheus';
import { ApproveDialogComponent, ApproveDialogInput } from './approve-dialog/approve-dialog.component';
import { Observable } from 'rxjs';

export interface DialogOptions {
  label: string;
  data: any;
  size: TuiDialogSize;
  dismissible: boolean;
  header: PolymorpheusContent;
  appearance: string;
  closeable: Observable<boolean>;
  required: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private readonly injector = inject(INJECTOR);
  private readonly dialogs = inject(TuiDialogService);

  constructor() { }

  openDialog(
    component:any,
    label?:string,
    data?: any,
    size:TuiDialogSize='s',
    dismissible:boolean=false,
    header: PolymorpheusContent=undefined,
    appearance?: string,
    closeable?: Observable<boolean>,
    required?: boolean
  ) {
    const comp = new PolymorpheusComponent(component,this.injector);
    return this.dialogs.open(comp ,{
      label: label,
      dismissible: dismissible,
      size: size,
      appearance: appearance,
      data: data
    })
  }

  openApproveDialog(
    label?:string,
    data?:ApproveDialogInput,
    size:TuiDialogSize='s',
    dismissible: boolean=true
  ): Observable<boolean> {
    return this.dialogs.open<boolean>( 
      new PolymorpheusComponent(ApproveDialogComponent,this.injector),{
      label: label,
      dismissible: dismissible,
      size: size,
      // appearance: appearance,
      data: data
    })
  }
}
