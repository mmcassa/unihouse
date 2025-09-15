import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[namedTemplate]',
})
export class NamedTemplateDirective {
  @Input('namedTemplate') name!: string;

  constructor(public template: TemplateRef<any>) {}
}
