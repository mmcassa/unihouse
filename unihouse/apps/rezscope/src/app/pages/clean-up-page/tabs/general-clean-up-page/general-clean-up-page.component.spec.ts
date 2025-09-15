import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralCleanUpPageComponent } from './general-clean-up-page.component';

describe('GeneralCleanUpPageComponent', () => {
  let component: GeneralCleanUpPageComponent;
  let fixture: ComponentFixture<GeneralCleanUpPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralCleanUpPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralCleanUpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
