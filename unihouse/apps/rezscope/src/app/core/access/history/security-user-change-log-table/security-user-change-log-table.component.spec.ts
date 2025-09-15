import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityUserChangeLogTableComponent } from './security-user-change-log-table.component';

describe('SecurityUserChangeLogTableComponent', () => {
  let component: SecurityUserChangeLogTableComponent;
  let fixture: ComponentFixture<SecurityUserChangeLogTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityUserChangeLogTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityUserChangeLogTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
