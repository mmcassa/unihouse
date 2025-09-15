import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePositionHistoryTableComponent } from './employee-position-history-table.component';

describe('EmployeePositionHistoryTableComponent', () => {
  let component: EmployeePositionHistoryTableComponent;
  let fixture: ComponentFixture<EmployeePositionHistoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeePositionHistoryTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePositionHistoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
