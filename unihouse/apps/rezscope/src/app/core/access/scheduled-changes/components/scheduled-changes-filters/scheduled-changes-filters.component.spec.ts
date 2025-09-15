import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledChangesFiltersComponent } from './scheduled-changes-filters.component';

describe('ScheduledChangesFiltersComponent', () => {
  let component: ScheduledChangesFiltersComponent;
  let fixture: ComponentFixture<ScheduledChangesFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledChangesFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledChangesFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
