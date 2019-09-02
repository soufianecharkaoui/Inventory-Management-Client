import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { GET_TRANSACTIONS, DELETE_TRANSACTION, REVOKE_TRANSACTION, UPDATE_TRANSACTION} from 'app/services/transactions.graphql';
import { map } from 'rxjs/operators';
import { CRUDTransactionsComponent } from '../crud-transactions/crud-transactions.component';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class AllTransactionsComponent implements OnInit {

  transactions: Transaction[];
  transaction: Transaction;
  cashed: boolean;
  
  displayedColumns: string[] = ['code', 'type', 'owner', 'agent', 'office', 'client', 'products', 'quantity_unit', 'price_unit', 'amount', 'edit', 'changeStatus', 'print', 'cashed'];
  dataSource: MatTableDataSource<Transaction>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apollo: Apollo,
    public dialog: MatDialog) { 
      this.dataSource = new MatTableDataSource(this.transactions);
    }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_TRANSACTIONS,
    })
    .valueChanges.pipe(map((result: any) => result.data.getTransactions))
    .subscribe(data => {
      this.transactions = data;
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
      }, refetchQueries: ['getProducts']
    })
    .subscribe();
  }

  delete(transaction: Transaction) {
    this.apollo.mutate({
      mutation: DELETE_TRANSACTION,
      variables: {
        id: transaction.id
      }, refetchQueries: ['getProducts']
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

