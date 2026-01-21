import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiButton, TuiDialogContext, TuiError, TuiSizeL, TuiSizeS, TuiTextfield } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExternalEnvironment, ExternalEnvironmentAuth } from '../../interfaces/environment-interface';
import { TuiFieldErrorPipe, TuiInputDate } from '@taiga-ui/kit';
import { ExtEnvironmentService } from '../../ext-environment.service';
import { TuiValidationError } from '@taiga-ui/cdk';

@Component({
  selector: 'uc-environment-auth-create-form',
  imports: [
    CommonModule,
    TuiTextfield,
    TuiError,
    TuiInputDate,
    TuiButton,
    TuiFieldErrorPipe,
    ReactiveFormsModule
  ],
  templateUrl: './environment-auth-create-form.html',
  styleUrl: './environment-auth-create-form.scss',
})
export class EnvironmentAuthCreateForm {
  public readonly context = injectContext<TuiDialogContext<number, ExternalEnvironment>>();
  public readonly environmentService = inject(ExtEnvironmentService);
  public readonly fb = inject(FormBuilder);
  size = input<TuiSizeL|TuiSizeS>('m');
  protected submission_error: string | TuiValidationError | null = null

  protected form = this.fb.group({
    extenvid: [this.context.data.id,],
    expiredate: [null,Validators.required],
    username: ['',],
    apikey: ['',Validators.required]
  })

  constructor() {

  }

  private transform_value(val:any): Partial<ExternalEnvironmentAuth> {
    const envauth = val as Partial<ExternalEnvironmentAuth>;
    return envauth;
  }

  submit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
    }
    const auth = this.transform_value(this.form.value);
    this.environmentService.create_external_environment_auth(auth).subscribe({
      next: (a) => {
        this.context.completeWith(1);
      },
       error: (err) => {
        this.submission_error = new TuiValidationError(err);
      }
    });
  }
}
