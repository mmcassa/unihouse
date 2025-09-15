import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledChangesBulkUpdateActionsComponent } from './scheduled-changes-bulk-update-actions.component';

describe('ScheduledChangesBulkUpdateActionsComponent', () => {
  let component: ScheduledChangesBulkUpdateActionsComponent;
  let fixture: ComponentFixture<ScheduledChangesBulkUpdateActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledChangesBulkUpdateActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledChangesBulkUpdateActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
