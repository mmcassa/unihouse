import { Component, ContentChildren, inject, input, OnInit, output, QueryList, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { tuiCountFilledControls } from '@taiga-ui/cdk';
import { debounceTime, map } from 'rxjs';
import { NamedTemplateDirective } from '../../directives/named-template.directive';
import { GenericFiltersInterface } from '../search-filters.interface';
import { TuiTextfield } from '@taiga-ui/core';
import { CommonModule } from '@angular/common';

export type FiltersMode = 'modal' | 'inline' | 'expand';

@Component({
  selector: 'app-generic-filters',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TuiTextfield,
  ],
  templateUrl: './generic-filters.component.html',
  styleUrl: './generic-filters.component.scss'
})
export class GenericFiltersComponent<T extends GenericFiltersInterface> implements OnInit {
  @ContentChildren(NamedTemplateDirective) templates!: QueryList<NamedTemplateDirective>;

  private readonly fb = inject(FormBuilder);
  private readonly placeholder_default = 'Search';
  protected filters: string[] = ['search'];
  protected form!: FormGroup;

  protected readonly count = signal(0);

  mode = input<FiltersMode>('inline');
  hide = input<(keyof T)[]>();
  show = input<(keyof T)[]>();
  initial = input<T>();
  placeholder = input<string>(this.placeholder_default);
  onUpdate = output<T>();

  ngOnInit(): void {
    
    let o: {[key: string]: any } = {}
    for (let f of this.filters) {
      o[f] = []
    }
    this.form = this.fb.group(o);
    this.on_update();

    const initial = this.initial();
    // const hide = this.hide();
    const show = this.show();

    if (initial != null) {
      // set initial values
      for (let key of Object.keys(initial)) {
        this.form.get(key)?.setValue(initial[key as keyof T])
      }
    }
    // if (hide != null) {
    //   for (let key of hide) {
    //     this.form.get(key)?.disable();
    //   }
    // }
    if (show != null) {
      for (let control of Object.keys(this.form.controls)) {
        if (! (control in show)) {
          this.form.get(control)?.disable();
        }
      }
    }
  }

  protected filters_formatter(value:any) {
    return value
  }

  private on_update() {
    // On Changes
    this.form.valueChanges.pipe(
      debounceTime(500),

      map((changes) => {
        this.onUpdate.emit(this.filters_formatter(this.form.value));
        const x = tuiCountFilledControls(this.form); 
        this.count.set(x);
        return x;
      })
    ).subscribe();
  }

  protected show_filter(name: string) {
    const hide = this.hide();
    return hide == null || (hide.find(x => name === x) === undefined)
  }
}
