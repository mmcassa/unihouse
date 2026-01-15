import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scheduledChangeType'
})
export class ScheduledChangeTypePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case 1:
        return 'START';
      case 3:
        return 'TRANSFER';
      case 2:
        return 'END';
        
      default:
        return 'UNSPECIFIED'
    }
  }

}
