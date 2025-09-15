import { Component, inject, input, OnInit, output } from '@angular/core';
import { Collection, CollectionEnvironment, ExtEnvironmentService, ExternalEnvironment } from '../ext-environment.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { TuiAutoFocus, TuiContext, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiButton, TuiHint, TuiLoader, TuiSelect, TuiTextfield } from '@taiga-ui/core';
import { TuiCheckbox, TuiChevron, TuiDataListWrapper } from '@taiga-ui/kit';
import { Observable } from 'rxjs';
import { TuiInputModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-add-collection-form',
  standalone: true,
  imports: [ReactiveFormsModule,
        TuiHint,
        TuiInputModule,
        TuiButton,
        TuiTextfield,
        TuiAutoFocus,
        TuiTextfieldControllerModule,],
  templateUrl: './add-collection-form.component.html',
  styleUrl: './add-collection-form.component.scss'
})
export class AddCollectionFormComponent {
  private readonly environmentService = inject(ExtEnvironmentService);
  private readonly formBuilder = inject(FormBuilder);

  protected loaded_environments: boolean = false;

  output = output<Collection|void>();

  protected form: FormGroup;

  constructor() {

    this.form = this.formBuilder.group({
      name: ['',[ Validators.required,Validators.maxLength(30)]]
    });

  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (! this.form.valid)
      return;
    
    this.environmentService.addCollection(
      this.form.controls['name'].value
    ).subscribe({
      next: res => {
        this.output.emit(res);
      }, error: res => {
        this.output.emit();
      }
    })
  }

  @tuiPure
      stringify(
          items: readonly ExternalEnvironment[],
      ): TuiStringHandler<TuiContext<number>> {
          const map = new Map(items.map(({id, name}) => [id, name] as [number, string]));
   
          return ({$implicit}: TuiContext<number>) => map.get($implicit) || '';
      }
}
