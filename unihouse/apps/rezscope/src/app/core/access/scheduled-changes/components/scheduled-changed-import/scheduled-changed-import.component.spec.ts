import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledChangedImportComponent } from './scheduled-changed-import.component';

describe('ScheduledChangedImportComponent', () => {
  let component: ScheduledChangedImportComponent;
  let fixture: ComponentFixture<ScheduledChangedImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledChangedImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledChangedImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
