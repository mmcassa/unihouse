import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomProcess } from '../process';

@Component({
  selector: 'uc-process-card',
  imports: [CommonModule],
  templateUrl: './process-card.html',
  styleUrl: './process-card.scss',
})
export class ProcessCard {
    process = input<CustomProcess>();
  
}
