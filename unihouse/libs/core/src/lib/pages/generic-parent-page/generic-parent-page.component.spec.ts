import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericParentPageComponent } from './generic-parent-page.component';

describe('GenericParentPageComponent', () => {
  let component: GenericParentPageComponent;
  let fixture: ComponentFixture<GenericParentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericParentPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericParentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
