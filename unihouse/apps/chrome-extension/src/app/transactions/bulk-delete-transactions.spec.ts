import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BulkDeleteTransactions } from './bulk-delete-transactions';

describe('BulkDeleteTransactions', () => {
  let component: BulkDeleteTransactions;
  let fixture: ComponentFixture<BulkDeleteTransactions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkDeleteTransactions],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkDeleteTransactions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
