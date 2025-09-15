import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAvailabilityPageComponent } from './room-availability-page.component';

describe('RoomAvailabilityPageComponent', () => {
  let component: RoomAvailabilityPageComponent;
  let fixture: ComponentFixture<RoomAvailabilityPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomAvailabilityPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomAvailabilityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
