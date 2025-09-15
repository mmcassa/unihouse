import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeActionsComponent } from './employee-actions.component';

describe('EmployeeActionsComponent', () => {
  let component: EmployeeActionsComponent;
  let fixture: ComponentFixture<EmployeeActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
