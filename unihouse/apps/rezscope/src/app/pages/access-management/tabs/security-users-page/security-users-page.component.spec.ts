import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityUsersPageComponent } from './security-users-page.component';

describe('SecurityUsersPageComponent', () => {
  let component: SecurityUsersPageComponent;
  let fixture: ComponentFixture<SecurityUsersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityUsersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
