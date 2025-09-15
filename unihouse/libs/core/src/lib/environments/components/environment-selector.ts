import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiTextfield } from '@taiga-ui/core';
import { TuiDataListWrapper } from '@taiga-ui/kit';

@Component({
  selector: 'uc-environment-selector',
  imports: [
    CommonModule,
    TuiTextfield,
    TuiDataListWrapper
  ],
  templateUrl: './environment-selector.html',
  styleUrl: './environment-selector.scss',
})
export class EnvironmentSelector {}
