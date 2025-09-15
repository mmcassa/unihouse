import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameAvatarComponent } from './name-avatar.component';

describe('NameAvatarComponent', () => {
  let component: NameAvatarComponent;
  let fixture: ComponentFixture<NameAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
