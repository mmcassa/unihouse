import { Component, inject, input, OnInit, output } from '@angular/core';
import { Collection, CollectionEnvironment, ExtEnvironmentService, ExternalEnvironment } from '../ext-environment.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiContext, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiButton, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { TuiChevron, TuiDataListWrapper } from '@taiga-ui/kit';
import { Observable } from 'rxjs';
import { TuiTextfieldControllerModule } from '@taiga-ui/legacy';

@Component({
  selector: 'app-add-collection-environment-form',
  standalone: true,
  imports: [
      ReactiveFormsModule,
      TuiButton,
      TuiChevron,
      TuiDataListWrapper,
      TuiTextfieldControllerModule,
      TuiLoader,
      TuiTextfield
    ],
  templateUrl: './add-collection-environment-form.component.html',
  styleUrl: './add-collection-environment-form.component.scss'
})
export class AddCollectionEnvironmentFormComponent implements OnInit {
  private readonly environmentService = inject(ExtEnvironmentService);
  private readonly formBuilder = inject(FormBuilder);

  protected environments: ExternalEnvironment[] = [];
  protected environments$: Observable<ExternalEnvironment[]>;
  protected loaded_environments: boolean = false;

  collection = input<Collection>();
  output = output<CollectionEnvironment|void>();

  protected form: FormGroup;

  constructor() {
    this.environments$ = this.environmentService.getExternalEnvironments().pipe();
    this.environments$.subscribe(data => {
      this.environments = data;
      this.loaded_environments = true;
    });

    this.form = this.formBuilder.group({
      collection_id: [this.collection()?.id, Validators.required],
      environment_id: [undefined, [Validators.required]]
    });

  }

  ngOnInit() {
    this.form.controls['collection_id'].setValue(this.collection()?.id);
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (! this.form.valid)
      return;
    
    this.environmentService.addCollectionEnvironment(
      this.form.controls['collection_id'].value,
      this.form.controls['environment_id'].value
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
