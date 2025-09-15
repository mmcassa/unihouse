import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEnvironmentsPageComponent } from './manage-environments-page.component';

describe('ManageEnvironmentsPageComponent', () => {
  let component: ManageEnvironmentsPageComponent;
  let fixture: ComponentFixture<ManageEnvironmentsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEnvironmentsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEnvironmentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
