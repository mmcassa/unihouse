import { Component, input } from '@angular/core';
import { OBSERVABLE_BUTTON_DESIGN_DEFAULT, ObservableButtonDesignOptions, ObservableButtonFunctionOptions } from '../observable-button.interface';
import { TuiLet } from '@taiga-ui/cdk';
import { Observable } from 'rxjs';
import { TuiButton, TuiDataList, TuiDropdown, TuiGroup } from '@taiga-ui/core';
import { TuiButtonLoading, TuiChevron, TuiDataListWrapper } from '@taiga-ui/kit';



@Component({
  selector: 'app-observable-button-with-dropdown',
  imports: [
    TuiDataList,
    TuiDataListWrapper,
    TuiDropdown,
    TuiGroup,
    TuiButton,
    TuiButtonLoading,
    TuiChevron,
    TuiLet
  ],
  templateUrl: './observable-button-with-dropdown.component.html',
  styleUrl: './observable-button-with-dropdown.component.scss'
})
export class ObservableButtonWithDropdownComponent {
  design = input<Partial<ObservableButtonDesignOptions>>(OBSERVABLE_BUTTON_DESIGN_DEFAULT);
  functions = input<ObservableButtonFunctionOptions[]>([]);
  protected show_additional_actions: boolean = false;
  protected loading = false;

  protected call_action(fnc: undefined|((...args: any[]) => Observable<any>),args: any[]|undefined) {
    if (fnc == undefined) return;
    if (this.loading) return; // Prevent duplicate calls
    this.loading = true;
    fnc(...args ?? []).subscribe({
      next: () => {},
      error: () => { this.loading = false; },
      complete: () => { this.loading = false; }
    });
  }

  
}
