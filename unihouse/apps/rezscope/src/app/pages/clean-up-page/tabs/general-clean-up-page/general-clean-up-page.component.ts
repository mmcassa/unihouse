import { Component, inject, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionCardComponent, GenericAction, StarrezManagementService } from '@unihouse/core';
import { StarrezAccessService } from 'apps/rezscope/src/app/core/access';


@Component({
  selector: 'app-general-clean-up-page',
  imports: [
    ActionCardComponent,
    CommonModule,
  ],
  templateUrl: './general-clean-up-page.component.html',
  styleUrl: './general-clean-up-page.component.scss'
})
export class GeneralCleanUpPageComponent {
  clear_duty_report_template = viewChild<TemplateRef<any>>('clearDutyReport');
  private readonly managementService = inject(StarrezManagementService);
  private readonly accessService = inject(StarrezAccessService);

  
  protected actions: GenericAction[] = [
    {
      title: 'Clear Duty Report',
      subtitle: 'RPS',
      icon: '@tui.book',
      appearance: 'error',
      description: 'Clears duty report notes dating back 1 month or more.',
      action: () => this.managementService.clearDutyReport(4)
    }, {
      title: 'Clear Inactive Waitlist',
      subtitle: "WAITLIST RENEWAL",
      icon: '@tui.list-x',
      appearance: 'error',
      description: 'Use this after waitlist renewals. It will delete all inactive waitlists.',
      action: () => this.managementService.clear_inactive_waitlist_entryapplications()
    },{
      title: 'Test API',
      subtitle: "TEST",
      icon: '@tui.flask-conical',
      appearance: 'warning',
      description: 'Test API call that is manually setup. BEWARE!',
      action: () => this.accessService.test()
    }, {
      title: 'Update Conference Addresses',
      subtitle: 'CONFERENCE',
      icon : '@tui.presentation',
      description: 'Copies any known addresses from an existing conference event to it\s groups/sessions.',
      action: () => this.accessService.updateConferenceAddresses()
    }, {
      title: 'Auto Detect Access',
      subtitle: 'EMPLOYEES',
      icon: '@tui.refresh-cw',
      appearance: 'success',
      description: 'Pulls current access from StarRez and detects any changes in positions',
      action: () => this.accessService.autodetect()
    }, {
      title: 'Auto Detect Scheduled Changes',
      subtitle: 'EMPLOYEES',
      icon: '@tui.calendar-sync',
      appearance: 'success',
      description: 'Pulls any expected student worker employment changes from StarRez to add to the employment schedule.',
      action: () => this.accessService.detect_new_scheduled_changes()
    }, {
      title: 'Add Electronic Identites',
      subtitle: 'EIDS',
      icon: '@tui.id-card',
      appearance: 'success',
      description: 'Adds electronic identities if they do not already have them.',
      action: () => this.managementService.add_electronic_identities()
    }
  ] 


}
