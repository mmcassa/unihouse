import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvironmentAuthCreateForm } from './environment-auth-create-form';

describe('EnvironmentAuthCreateForm', () => {
  let component: EnvironmentAuthCreateForm;
  let fixture: ComponentFixture<EnvironmentAuthCreateForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentAuthCreateForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EnvironmentAuthCreateForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
