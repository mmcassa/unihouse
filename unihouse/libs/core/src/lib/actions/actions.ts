import { TemplateRef } from "@angular/core";
import { Observable } from "rxjs";


export interface GenericAction {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: string;
  appearance?: string;
  action?: () => Observable<any>;
}