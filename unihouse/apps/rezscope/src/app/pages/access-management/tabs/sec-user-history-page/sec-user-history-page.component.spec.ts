import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecUserHistoryPageComponent } from './sec-user-history-page.component';

describe('SecUserHistoryPageComponent', () => {
  let component: SecUserHistoryPageComponent;
  let fixture: ComponentFixture<SecUserHistoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecUserHistoryPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecUserHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
