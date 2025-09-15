import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledChangesTableComponent } from './scheduled-changes-table.component';

describe('ScheduledChangesTableComponent', () => {
  let component: ScheduledChangesTableComponent;
  let fixture: ComponentFixture<ScheduledChangesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledChangesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledChangesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
