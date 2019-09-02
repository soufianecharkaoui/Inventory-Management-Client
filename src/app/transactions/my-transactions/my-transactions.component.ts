import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { GET_TRANSACTIONS, REVOKE_TRANSACTION, DELETE_TRANSACTION, UPDATE_TRANSACTION } from 'app/services/transactions.graphql';
import { map } from 'rxjs/operators';
import { CRUDTransactionsComponent } from '../crud-transactions/crud-transactions.component';
import { AuthService } from 'app/login/auth.service';

@Component({
  selector: 'app-my-transactions',
  templateUrl: './my-transactions.component.html',
  styleUrls: ['./my-transactions.component.scss']
})
export class MyTransactionsComponent implements OnInit {

  transactions: Transaction[];
  transaction: Transaction;
  
  displayedColumns: string[] = ['code', 'type', 'agent', 'office', 'client', 'products', 'quantity_unit', 'price_unit', 'amount', 'edit', 'print', 'cashed'];
  dataSource: MatTableDataSource<Transaction>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apollo: Apollo,
    private authService: AuthService,
    public dialog: MatDialog) { 
      this.dataSource = new MatTableDataSource(this.transactions);
    }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_TRANSACTIONS,
    })
    .valueChanges.pipe(map((result: any) => result.data.getTransactions))
    .subscribe(data => {
      this.transactions = data.filter(transaction => transaction.user.id === this.authService.getUserId());
      this.dataSource = new MatTableDataSource(this.transactions);
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

  edit(transaction: Transaction) {
    const dialogRef = this.dialog.open(CRUDTransactionsComponent, {
      width: '1500px',
      data: transaction
    });
  }

  revoke(transaction: Transaction) {
    this.apollo.mutate({
      mutation: REVOKE_TRANSACTION,
      variables: {
        id: transaction.id
      }
    })
    .subscribe();
  }

  updateCashed(transaction: Transaction) {
    this.apollo.mutate({
      mutation: UPDATE_TRANSACTION,
      variables: {
        id: transaction.id,
        input: transaction.input,
        userId: transaction.user.id,
        warehouseId: transaction.warehouse.id,
        type: transaction.type ? transaction.type : '',
        clientName: transaction.clientName ? transaction.clientName : '',
        hasClientEmail: transaction.hasClientEmail,
        clientEmail: transaction.clientEmail ? transaction.clientEmail : '',
        clientPhone: transaction.clientPhone ? transaction.clientPhone : '',
        clientAddress: transaction.clientAddress ? transaction.clientAddress : '',
        productId: transaction.product.id,
        transactionQuantity: transaction.transactionQuantity,
        buyingPrice: transaction.input ? transaction.buyingPrice : 0,
        sellingPrice: !transaction.input ? transaction.sellingPrice : 0,
        amount: transaction.amount,
        packaging: transaction.packaging ? transaction.packaging : '',
        currency: transaction.currency,
        paymentMethod: transaction.paymentMethod ? transaction.paymentMethod : '',
        otherPaymentMethod: transaction.otherPaymentMethod ? transaction.otherPaymentMethod : '',
        agentId: transaction.agent.id,
        cashed: !transaction.cashed,
        code: transaction.code
      }, refetchQueries: ['getTransactions']
    })
    .subscribe();
  }

}
