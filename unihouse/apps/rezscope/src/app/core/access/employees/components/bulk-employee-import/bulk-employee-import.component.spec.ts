import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkEmployeeImportComponent } from './bulk-employee-import.component';

describe('BulkEmployeeImportComponent', () => {
  let component: BulkEmployeeImportComponent;
  let fixture: ComponentFixture<BulkEmployeeImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkEmployeeImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkEmployeeImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
