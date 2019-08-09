import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { PaymentMethod } from 'app/types';
import { REVOKE_PAYMENT_METHOD, DELETE_PAYMENT_METHOD, UPDATE_PAYMENT_METHOD, ADD_PAYMENT_METHOD, GET_PAYMENT_METHODS } from 'app/services/payment-methods.graphql';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsComponent implements OnInit {

  paymentMethods: PaymentMethod[];
  paymentMethod: PaymentMethod;
  
  displayedColumns: string[] = ['name', 'status', 'edit', 'changeStatus'];
  dataSource: MatTableDataSource<PaymentMethod>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apollo: Apollo,
    public dialog: MatDialog) { 
      this.dataSource = new MatTableDataSource(this.paymentMethods);
    }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_PAYMENT_METHODS
    })
    .valueChanges.pipe(map((result: any) => result.data.getPaymentMethods))
    .subscribe(data => {
      this.paymentMethods = data;
      this.dataSource = new MatTableDataSource(this.paymentMethods);
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

  edit(paymentMethod: PaymentMethod) {
    const dialogRef = this.dialog.open(CRUDPaymentMethods, {
      width: '250px',
      data: paymentMethod
    });
  }

  revoke(paymentMethod: PaymentMethod) {
    this.apollo.mutate({
      mutation: REVOKE_PAYMENT_METHOD,
      variables: {
        id: paymentMethod.id
      }
    })
    .subscribe();
  }

  delete(paymentMethod: PaymentMethod) {
    this.apollo.mutate({
      mutation: DELETE_PAYMENT_METHOD,
      variables: {
        id: paymentMethod.id
      }
    })
    .subscribe();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CRUDPaymentMethods, {
      width: '250px'
    });
  }

}

@Component({
  selector: 'crud-payment-methods',
  templateUrl: 'crud-payment-methods.html',
})
export class CRUDPaymentMethods implements OnInit{

  paymentMethodForm: FormGroup;
  brand: PaymentMethod;

  @ViewChild('pmform', {static: true}) paymentMethodFormDirective;

  constructor(
    public dialogRef: MatDialogRef<CRUDPaymentMethods>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentMethod,
    private fb: FormBuilder,
    private apollo: Apollo) {}

  createForm() {
    this.paymentMethodForm = this.fb.group({
      name: [this.data ? this.data.name : '', Validators.required]
    });
  }

  get name() { return this.paymentMethodForm.get('name'); }

  ngOnInit() {
    this.createForm();
  }

  save() {
    if (this.data) {
      this.apollo.mutate({
        mutation: UPDATE_PAYMENT_METHOD,
        variables: {
          id: this.data.id,
          name: this.paymentMethodForm.value.name
        },
        refetchQueries: ['getPaymentMethods']
      })
      .subscribe();
    } else {
      this.apollo.mutate({
        mutation: ADD_PAYMENT_METHOD,
        variables: {
          name: this.paymentMethodForm.value.name
        },
        refetchQueries: ['getPaymentMethods']
      })
      .subscribe();
    }
    this.paymentMethodFormDirective.resetForm();
    this.dialogRef.close();
  }

}
