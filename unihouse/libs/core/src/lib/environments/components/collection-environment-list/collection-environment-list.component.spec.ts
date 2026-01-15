import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionEnvironmentListComponent } from './collection-environment-list.component';

describe('CollectionEnvironmentListComponent', () => {
  let component: CollectionEnvironmentListComponent;
  let fixture: ComponentFixture<CollectionEnvironmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionEnvironmentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionEnvironmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
