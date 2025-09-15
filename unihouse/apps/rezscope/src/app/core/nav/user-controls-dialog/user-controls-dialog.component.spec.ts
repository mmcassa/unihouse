import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserControlsDialogComponent } from './user-controls-dialog.component';

describe('UserControlsDialogComponent', () => {
  let component: UserControlsDialogComponent;
  let fixture: ComponentFixture<UserControlsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserControlsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserControlsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
