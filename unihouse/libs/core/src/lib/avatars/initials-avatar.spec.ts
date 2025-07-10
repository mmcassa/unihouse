import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InitialsAvatar } from './initials-avatar';

describe('InitialsAvatar', () => {
  let component: InitialsAvatar;
  let fixture: ComponentFixture<InitialsAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialsAvatar],
    }).compileComponents();

    fixture = TestBed.createComponent(InitialsAvatar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
