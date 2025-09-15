import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLabelComponent } from './employee-label.component';

describe('EmployeeLabelComponent', () => {
  let component: EmployeeLabelComponent;
  let fixture: ComponentFixture<EmployeeLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
