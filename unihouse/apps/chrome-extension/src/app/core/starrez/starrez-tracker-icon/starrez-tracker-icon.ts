import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarrezTabTracker } from '../starrez-tab-tracker.service';
import { TabStatus } from '../utils';
import { TuiHintDirective, TuiIcon } from '@taiga-ui/core';


interface TrackerStatusMap {
  status: TabStatus;
  icon: string;
  icon_color?: string;
  description: string;
}

const tracker_status_map: TrackerStatusMap[] = [
  {
    'status' : 'active',
    'icon' : 'badge-check',
    'description' : 'A StarRez tab is active and available',
    'icon_color' : 'var(--tui-text-positive)'
  },
  {
    'status' : 'closed',
    'icon' : 'badge-minus',
    'description' : 'A StarRez tab is not active',
    'icon_color' : 'var(--tui-text-negative)'
  },
  {
    'status' : 'pending',
    'icon' : 'loader',
    'description' : 'Updating StarRez tab tracker...',
  },
  {
    'status' : 'init',
    'icon' : 'minus',
    'description' : 'The StarRez tab tracker has not been initialized',
  },
];

@Component({
  selector: 'app-starrez-tracker-icon',
  imports: [
    CommonModule, 
    TuiIcon, 
    TuiHintDirective
  ],
  templateUrl: './starrez-tracker-icon.html',
  styleUrl: './starrez-tracker-icon.scss',
})
export class StarrezTrackerIcon {
  tracker = inject(StarrezTabTracker);
  protected status_icon?: string;
  protected status_hint?: string 
  protected status_color?: string;

  constructor() {
    this.update_status_settings('init');
    this.tracker.tab_status.subscribe({
      next: (status) => {
        this.update_status_settings(status);
      } 
    })
  }

  private update_status_settings(status: TabStatus) {
    this.status_icon = tracker_status_map.find(x => { return x.status === status})?.icon ?? '';
    this.status_hint = tracker_status_map.find(x => { return x.status === status})?.description;
    this.status_color = tracker_status_map.find(x => { return x.status === status})?.icon_color;
  }
}
