import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentCollectionDropdownComponent } from './environment-collection-dropdown.component';

describe('EnvironmentCollectionDropdownComponent', () => {
  let component: EnvironmentCollectionDropdownComponent;
  let fixture: ComponentFixture<EnvironmentCollectionDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentCollectionDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvironmentCollectionDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
