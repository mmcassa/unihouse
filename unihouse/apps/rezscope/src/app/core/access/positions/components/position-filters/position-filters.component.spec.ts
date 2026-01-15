import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionFiltersComponent } from './position-filters.component';

describe('PositionFiltersComponent', () => {
  let component: PositionFiltersComponent;
  let fixture: ComponentFixture<PositionFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
