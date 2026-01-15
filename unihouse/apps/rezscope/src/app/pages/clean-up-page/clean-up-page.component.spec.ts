import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CleanUpPageComponent } from './clean-up-page.component';

describe('CleanUpPageComponent', () => {
  let component: CleanUpPageComponent;
  let fixture: ComponentFixture<CleanUpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CleanUpPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CleanUpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
