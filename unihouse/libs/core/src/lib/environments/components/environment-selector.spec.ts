import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvironmentSelector } from './environment-selector';

describe('EnvironmentSelector', () => {
  let component: EnvironmentSelector;
  let fixture: ComponentFixture<EnvironmentSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(EnvironmentSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
