import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledChangesImportComponent } from './scheduled-changes-import.component';

describe('ScheduledChangesImportComponent', () => {
  let component: ScheduledChangesImportComponent;
  let fixture: ComponentFixture<ScheduledChangesImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduledChangesImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledChangesImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
