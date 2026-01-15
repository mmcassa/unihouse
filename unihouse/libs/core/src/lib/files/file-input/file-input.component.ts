import { AsyncPipe } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiLet } from '@taiga-ui/cdk';
import { TuiFileLike, TuiFiles } from '@taiga-ui/kit';
import { Subject, switchMap, Observable, of, timer, map, finalize, tap } from 'rxjs';

export const ACCEPT_FILE_TYPES = {
  any: '*',
  csv: '.csv',
  excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  spreadsheet: '.csv application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
  pdf: '*.pdf',
  image: 'image/*',
  png: 'image/png',
  jpeg: 'image/jpg, image/jpeg',
  doc: '.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
}

@Component({
  selector: 'app-file-input',
  imports: [
    AsyncPipe,
    TuiFiles,
    TuiLet,
    ReactiveFormsModule
  ],
  templateUrl: './file-input.component.html',
  styleUrl: './file-input.component.scss'
})
export class FileInputComponent {
  protected readonly control = new FormControl<TuiFileLike | null>(
        null,
        Validators.required,
    );
 
    protected readonly failedFiles$ = new Subject<TuiFileLike | null>();
    protected readonly loadingFiles$ = new Subject<TuiFileLike | null>();
    protected readonly loadedFiles$ = this.control.valueChanges.pipe(
        switchMap((file) => this.processFile(file)),
        tap({ next: v => {
          if (v) { 
            this.file.emit(v); 
          }
        }})
    );
    file = output<TuiFileLike>();
 
    protected removeFile(): void {
        this.control.setValue(null); 
    }
 
    protected processFile(file: TuiFileLike | null): Observable<TuiFileLike | null> {
        this.failedFiles$.next(null);
 
        if (this.control.invalid || !file) {
            return of(null);
        }
 
        this.loadingFiles$.next(file);
 
        return timer(1000).pipe(
            map(() => {
                // if (Math.random() > 0.5) {
                    return file;
                // }
                // this.failedFiles$.next(file);
 
                // return null;
            }),
            finalize(() => this.loadingFiles$.next(null)),
        );
    }
}
