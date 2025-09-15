import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scheduledChangeTypeAppearance'
})
export class ScheduledChangeTypeAppearancePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    switch (value) {
      case "START":
        return 'success';
      case "TRANSFER":
        return 'warning';
      case "END":
        return 'error';
      case 1:
        return 'success';
      case 3:
        return 'warning';
      case 2:
        return 'error';

      default:
        return 'neutral'
    }
  }

}
