import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MergePositionComponent } from './merge-position.component';

describe('MergePositionComponent', () => {
  let component: MergePositionComponent;
  let fixture: ComponentFixture<MergePositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MergePositionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MergePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
