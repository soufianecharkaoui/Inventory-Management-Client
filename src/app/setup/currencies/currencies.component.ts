import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Currency } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Apollo } from 'apollo-angular';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GET_CURRENCIES, REVOKE_CURRENCY, DELETE_CURRENCY, UPDATE_CURRENCY, ADD_CURRENCY } from 'app/services/currencies.graphql';

@Component({
  selector: 'app-currencies',
  templateUrl: './currencies.component.html',
  styleUrls: ['./currencies.component.scss']
})
export class CurrenciesComponent implements OnInit {

  currencies: Currency[];
  currency: Currency;
  
  displayedColumns: string[] = ['name', 'status', 'edit', 'changeStatus'];
  dataSource: MatTableDataSource<Currency>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apollo: Apollo,
    public dialog: MatDialog) { 
      this.dataSource = new MatTableDataSource(this.currencies);
    }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_CURRENCIES
    })
    .valueChanges.pipe(map((result: any) => result.data.getCurrencies))
    .subscribe(data => {
      this.currencies = data;
      this.dataSource = new MatTableDataSource(this.currencies);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(currency: Currency) {
    const dialogRef = this.dialog.open(CRUDCurrencies, {
      width: '300px',
      data: currency
    });
  }

  revoke(currency: Currency) {
    this.apollo.mutate({
      mutation: REVOKE_CURRENCY,
      variables: {
        id: currency.id
      }
    })
    .subscribe();
  }

  delete(currency: Currency) {
    this.apollo.mutate({
      mutation: DELETE_CURRENCY,
      variables: {
        id: currency.id
      }
    })
    .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CRUDCurrencies, {
      width: '300px'
    });
  }

}

@Component({
  selector: 'crud-currencies',
  templateUrl: 'crud-currencies.html',
  styleUrls: ['./currencies.component.scss']
})
export class CRUDCurrencies implements OnInit{

  currencyForm: FormGroup;
  currency: Currency;

  @ViewChild('cform', {static: true}) currencyFormDirective;

  constructor(
    public dialogRef: MatDialogRef<CRUDCurrencies>,
    @Inject(MAT_DIALOG_DATA) public data: Currency,
    private fb: FormBuilder,
    private apollo: Apollo) {}

  createForm() {
    this.currencyForm = this.fb.group({
      name: [this.data ? this.data.name : '', Validators.required]
    });
  }

  get name() { return this.currencyForm.get('name'); }

  ngOnInit() {
    this.createForm();
  }

  save() {
    if (this.data) {
      this.apollo.mutate({
        mutation: UPDATE_CURRENCY,
        variables: {
          id: this.data.id,
          name: this.currencyForm.value.name
        },
        refetchQueries: ['getCurrencies']
      })
      .subscribe();
    } else {
      this.apollo.mutate({
        mutation: ADD_CURRENCY,
        variables: {
          name: this.currencyForm.value.name
        },
        refetchQueries: ['getCurrencies']
      })
      .subscribe();
    }
    this.currencyFormDirective.resetForm();
    this.dialogRef.close();
  }
}
