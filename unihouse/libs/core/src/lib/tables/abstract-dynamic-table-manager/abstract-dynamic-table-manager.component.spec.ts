import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractDynamicTableManagerComponent } from './abstract-dynamic-table-manager.component';

describe('AbstractDynamicTableManagerComponent', () => {
  let component: AbstractDynamicTableManagerComponent;
  let fixture: ComponentFixture<AbstractDynamicTableManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbstractDynamicTableManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractDynamicTableManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
