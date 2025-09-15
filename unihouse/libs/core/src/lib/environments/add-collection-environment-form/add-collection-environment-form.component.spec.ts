import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCollectionEnvironmentFormComponent } from './add-collection-environment-form.component';

describe('AddCollectionEnvironmentFormComponent', () => {
  let component: AddCollectionEnvironmentFormComponent;
  let fixture: ComponentFixture<AddCollectionEnvironmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCollectionEnvironmentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCollectionEnvironmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
