import { Component, OnInit, ViewChild } from '@angular/core';
import { Transaction } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { GET_TRANSACTIONS, REVOKE_TRANSACTION, DELETE_TRANSACTION } from 'app/services/transactions.graphql';
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
  
  displayedColumns: string[] = ['code', 'type', 'agent', 'office', 'client', 'products', 'quantity_unit', 'price_unit', 'edit', 'print'];
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

  delete(transaction: Transaction) {
    this.apollo.mutate({
      mutation: DELETE_TRANSACTION,
      variables: {
        id: transaction.id
      }
    })
    .subscribe();
  }

}
