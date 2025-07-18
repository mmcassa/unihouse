import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamilyVerification } from './family-verification';

describe('FamilyVerification', () => {
  let component: FamilyVerification;
  let fixture: ComponentFixture<FamilyVerification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyVerification],
    }).compileComponents();

    fixture = TestBed.createComponent(FamilyVerification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
