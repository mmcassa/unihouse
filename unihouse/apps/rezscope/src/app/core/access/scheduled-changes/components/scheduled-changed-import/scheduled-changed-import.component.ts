import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiFileLike, TuiFiles } from '@taiga-ui/kit';
import { FileInputComponent } from '@unihouse/core';

@Component({
  selector: 'app-scheduled-changed-import',
  imports: [
    FileInputComponent,
    TuiFiles,
    ReactiveFormsModule
  ],
  templateUrl: './scheduled-changed-import.component.html',
  styleUrl: './scheduled-changed-import.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduledChangedImportComponent implements OnChanges {
    file?: TuiFileLike;
    
    ngOnChanges(changes: SimpleChanges): void {
        if ('file' in changes) {
            console.log(this.file?.content)
        }
    }
}
