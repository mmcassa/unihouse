import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservableButtonWithDropdownComponent } from './observable-button-with-dropdown.component';

describe('ObservableButtonWithDropdownComponent', () => {
  let component: ObservableButtonWithDropdownComponent;
  let fixture: ComponentFixture<ObservableButtonWithDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservableButtonWithDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObservableButtonWithDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
