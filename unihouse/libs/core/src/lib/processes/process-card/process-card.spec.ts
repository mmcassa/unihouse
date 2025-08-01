import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessCard } from './process-card';

describe('ProcessCard', () => {
  let component: ProcessCard;
  let fixture: ComponentFixture<ProcessCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
