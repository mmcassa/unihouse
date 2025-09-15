import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionLabelComponent } from './position-label.component';

describe('PositionLabelComponent', () => {
  let component: PositionLabelComponent;
  let fixture: ComponentFixture<PositionLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionLabelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
