import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CRUDTransactionsComponent } from './crud-transactions.component';

describe('CRUDTransactionsComponent', () => {
  let component: CRUDTransactionsComponent;
  let fixture: ComponentFixture<CRUDTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CRUDTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CRUDTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
