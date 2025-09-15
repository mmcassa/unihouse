import { TuiSizeL, TuiSizeS, TuiAppearanceOptions } from "@taiga-ui/core";
import { Observable } from "rxjs";

export interface ObservableButtonDesignOptions {
  size: TuiSizeL|TuiSizeS;
  appearance: TuiAppearanceOptions['appearance'];
  icon?: string;
}

export interface ObservableButtonFunctionOptions {
  button_label?: string;
  hint?: string;
  disabled?: boolean;
  callback_fnc?: (...args: any[]) => Observable<any>;
  callback_args?: any[];

}

export interface ObservableButtonOptions extends ObservableButtonDesignOptions, ObservableButtonFunctionOptions {
  
}

export const OBSERVABLE_BUTTON_DESIGN_DEFAULT: ObservableButtonDesignOptions = {
    size:  's',
    appearance: 'primary',
}