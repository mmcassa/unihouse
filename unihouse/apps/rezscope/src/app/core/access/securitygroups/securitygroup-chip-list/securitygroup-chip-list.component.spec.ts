import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritygroupChipListComponent } from './securitygroup-chip-list.component';

describe('SecuritygroupChipListComponent', () => {
  let component: SecuritygroupChipListComponent;
  let fixture: ComponentFixture<SecuritygroupChipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecuritygroupChipListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecuritygroupChipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
