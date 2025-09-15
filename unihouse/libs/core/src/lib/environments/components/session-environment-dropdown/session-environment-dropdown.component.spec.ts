import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionEnvironmentDropdownComponent } from './session-environment-dropdown.component';

describe('SessionEnvironmentDropdownComponent', () => {
  let component: SessionEnvironmentDropdownComponent;
  let fixture: ComponentFixture<SessionEnvironmentDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionEnvironmentDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionEnvironmentDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
