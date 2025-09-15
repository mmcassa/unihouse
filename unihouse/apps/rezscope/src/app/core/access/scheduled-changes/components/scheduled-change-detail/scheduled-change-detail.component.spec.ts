import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledChangeDetailComponent } from './scheduled-change-detail.component';

describe('ScheduledChangeDetailComponent', () => {
  let component: ScheduledChangeDetailComponent;
  let fixture: ComponentFixture<ScheduledChangeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledChangeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledChangeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
