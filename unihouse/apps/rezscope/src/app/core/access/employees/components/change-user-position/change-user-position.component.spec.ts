import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUserPositionComponent } from './change-user-position.component';

describe('ChangeUserPositionComponent', () => {
  let component: ChangeUserPositionComponent;
  let fixture: ComponentFixture<ChangeUserPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeUserPositionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeUserPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
