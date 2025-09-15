import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledChangeApplyComponent } from './scheduled-change-apply.component';

describe('ScheduledChangeApplyComponent', () => {
  let component: ScheduledChangeApplyComponent;
  let fixture: ComponentFixture<ScheduledChangeApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledChangeApplyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledChangeApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
