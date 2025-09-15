import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'environmentType',
})
export class EnvironmentTypePipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value !== 'number') {
      return null
    }
    switch (value) {
      case 1:
        return 'StarRez API';
      case 2:
        return 'Campus Labs Legacy API';
      case 3: 
        return 'Campus Labs v3 API'
      default:
        return 'Unknown';
    }
  }
}
