import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsStepper } from './tabs-stepper';

describe('TabsStepper', () => {
  let component: TabsStepper;
  let fixture: ComponentFixture<TabsStepper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsStepper],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsStepper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
