import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarrezTabTracker } from '../starrez-tab-tracker.service';
import { TabStatus } from '../utils';
import { TuiIcon } from '@taiga-ui/core';

const tracker_icon_status_map = {
  'active': 'badge-check',
  'closed': 'badge-minus',
  'pending': 'loader', 
  'init': 'minus'
}
@Component({
  selector: 'app-starrez-tracker-icon',
  imports: [CommonModule, TuiIcon],
  templateUrl: './starrez-tracker-icon.html',
  styleUrl: './starrez-tracker-icon.scss',
})
export class StarrezTrackerIcon {
  tracker = inject(StarrezTabTracker);
  protected status: string = tracker_icon_status_map['init'];


  constructor() {
    this.tracker.tab_status.subscribe({
      next: (status) => {
        this.status = tracker_icon_status_map[status];
      } 
    })
  }
}
