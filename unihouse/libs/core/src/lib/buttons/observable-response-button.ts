import { Component, input } from '@angular/core';
import { TuiAppearanceOptions, TuiButton, TuiHint, TuiSizeL, TuiSizeS } from '@taiga-ui/core';
import { TuiButtonLoading } from '@taiga-ui/kit';
import { Observable } from 'rxjs';
import { OBSERVABLE_BUTTON_DESIGN_DEFAULT } from './observable-button.interface';

/**
 * Generic button that expects an Observable as the callback function's response
 */
@Component({
  selector: 'observable-button',
  standalone: true,
  imports: [
    TuiButton,
    TuiButtonLoading,
    TuiHint
  ],
  templateUrl: './observable-response-button.html'
})
export class ObservableButton {
  size = input<TuiSizeL|TuiSizeS>(OBSERVABLE_BUTTON_DESIGN_DEFAULT.size);
  appearance = input<TuiAppearanceOptions['appearance']>(OBSERVABLE_BUTTON_DESIGN_DEFAULT.appearance);
  button_label = input<string>("Select");
  icon = input<string>();
  hint = input<string>();
  callback_fnc= input<(...args: any[]) => Observable<any>>(() => { return new Observable() });
  callback_args = input<any[]>([]);
  disabled = input<boolean>(false);
  protected loading: boolean = false;
  

  protected setup_call() {
    return this.callback_fnc()(...this.callback_args())
  }

  protected onClick() {
    if (this.loading) return; // Prevent duplicate calls
    this.loading = true;
    this.setup_call().subscribe({
      next: () => {},
      error: () => { this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }
}