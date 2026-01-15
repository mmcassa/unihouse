import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledChangeTypeSelectorComponent } from './scheduled-change-type-selector.component';

describe('ScheduledChangeTypeSelectorComponent', () => {
  let component: ScheduledChangeTypeSelectorComponent;
  let fixture: ComponentFixture<ScheduledChangeTypeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledChangeTypeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledChangeTypeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
