import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ExtEnvironmentService, ExternalEnvironmentType } from '../ext-environment.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { TuiButton, TuiDataList, TuiLoader, TuiTextfield } from '@taiga-ui/core';
import { TuiInputModule, TuiSelectModule } from '@taiga-ui/legacy';
import { TuiCheckbox, tuiItemsHandlersProvider } from '@taiga-ui/kit';
import { TuiContext, TuiLet, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';

@Component({
  selector: 'app-add-environment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    TuiButton,
    TuiLoader,
    TuiDataList,
    TuiInputModule,
    TuiSelectModule,
    TuiTextfield,
    TuiLet,
    TuiCheckbox
  ],
  templateUrl: './add-environment-form.component.html',
  styleUrl: './add-environment-form.component.scss',
  providers: [
    tuiItemsHandlersProvider({
      stringify: (item: ExternalEnvironmentType) => `${item.name} (${item.context})`
    })
  ]
})
export class AddEnvironmentFromComponent {
  myForm: FormGroup;
  buttonSize: any = 's';
  loadedTypeOptions: boolean = false;
  typeOptions: ExternalEnvironmentType[] = [];
  typeOptions$: Observable<ExternalEnvironmentType[]>;
  statusMessage: string = '';
  showStatusMessage: boolean = false;
  isErrorStatus: boolean = false;


  constructor(private fb: FormBuilder, private http: HttpClient,private envService: ExtEnvironmentService) {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      prod: [true,[]],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
    });
    
    this.typeOptions$ = this.envService.get_external_environment_types().pipe();
    this.typeOptions$.subscribe({
      next: types => {
        this.typeOptions = types;
        this.loadedTypeOptions = true;
        this.myForm.get('type')?.setValue(this.typeOptions[0]);
      }, error: err => {
        
      }
    });

  }

  

  onSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;
      this.envService.addExternalEnvironment(formData).subscribe({
        next: response => {
          console.log('Form submitted successfully', response);
          
        },
        error: error => {
          console.error('Error submitting form', error);
        }
      });
    }
  }

  @tuiPure
    stringify(
        items: readonly ExternalEnvironmentType[],
    ): TuiStringHandler<TuiContext<number>> {
        const map = new Map(items.map(({id, name}) => [id, name] as [number, string]));
 
        return ({$implicit}: TuiContext<number>) => map.get($implicit) || '';
    }
}
