import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarrezTrackerIcon } from './starrez-tracker-icon';

describe('StarrezTrackerIcon', () => {
  let component: StarrezTrackerIcon;
  let fixture: ComponentFixture<StarrezTrackerIcon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarrezTrackerIcon],
    }).compileComponents();

    fixture = TestBed.createComponent(StarrezTrackerIcon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
