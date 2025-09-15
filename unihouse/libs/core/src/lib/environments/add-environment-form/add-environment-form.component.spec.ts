import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEnvironmentFormComponent } from './add-environment-form.component';

describe('AddEnvironmentFormComponent', () => {
  let component: AddEnvironmentFormComponent;
  let fixture: ComponentFixture<AddEnvironmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEnvironmentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEnvironmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
