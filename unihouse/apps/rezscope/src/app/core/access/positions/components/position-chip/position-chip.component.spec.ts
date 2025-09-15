import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionChipComponent } from './position-chip.component';

describe('PositionChipComponent', () => {
  let component: PositionChipComponent;
  let fixture: ComponentFixture<PositionChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionChipComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
