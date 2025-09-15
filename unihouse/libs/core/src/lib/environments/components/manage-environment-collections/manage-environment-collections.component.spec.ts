import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEnvironmentCollectionsComponent } from './manage-environment-collections.component';

describe('ManageEnvironmentCollectionsComponent', () => {
  let component: ManageEnvironmentCollectionsComponent;
  let fixture: ComponentFixture<ManageEnvironmentCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEnvironmentCollectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEnvironmentCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
