import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledChangesPageComponent } from './scheduled-changes-page.component';

describe('ScheduledChangesPageComponent', () => {
  let component: ScheduledChangesPageComponent;
  let fixture: ComponentFixture<ScheduledChangesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledChangesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledChangesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
