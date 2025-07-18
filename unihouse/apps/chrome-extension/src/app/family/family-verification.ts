import { Component, Signal, TemplateRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TuiStepper } from '@taiga-ui/kit';
import { TuiTable } from '@taiga-ui/addon-table';

@Component({
  selector: 'app-family-verification',
  imports: [
    CommonModule,
    TuiStepper,
    TuiTable
  ],
  templateUrl: './family-verification.html',
  styleUrl: './family-verification.scss',
})
export class FamilyVerification {
  selectentry = viewChild<TemplateRef<any>>('selectentry');
  selectfamilymembers = viewChild<TemplateRef<any>>('selectfamilymembers');
  selectterms = viewChild<TemplateRef<any>>('selectterms');
  confirmchanges = viewChild<TemplateRef<any>>('confirmchanges');

  
  
  protected active_step_idx = 0;

  // Step 1 
  protected entries_with_family = []
  protected selected_entry?: any;
  protected loading_entries_with_family: boolean = false;

  // Step 2
  protected entry_family_members = [];
  protected loading_entry_family_members: boolean = false;
  protected selected_entry_families = [];

  // Step 3 
  protected selected_terms_with_entry_bookings = [];
  protected loading_terms = [];

  // Step 4
  protected entry_occupants = [];
  protected action_stage: any;
  protected action_message: string = '';


  
  protected error_message?: string;
  



  get tab_templates(): (TemplateRef<any> | undefined)[] {
    return [
      this.selectentry(),
      this.selectfamilymembers(),
      this.selectterms(),
      this.confirmchanges()
    ];
  }

}
