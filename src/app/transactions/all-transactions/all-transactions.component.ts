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
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class AllTransactionsComponent implements OnInit {

  transactions: Transaction[];
  transaction: Transaction;
  cashed: boolean;
  $transaction: {
    input: boolean,
    user: string, 
    warehouse: string, 
    type: string, 
    clientName: string, 
    hasClientEmail: boolean, 
    clientEmail: string, 
    clientPhone: string, 
    clientAddress: string, 
    product: string, 
    transactionQuantity: number, 
    buyingPrice: number, 
    sellingPrice: number, 
    amount: number, 
    packaging: string, 
    currency: string, 
    paymentMethod: string, 
    otherPaymentMethod: string, 
    agent: string, 
    cashed: boolean, 
    code: string, 
    createdAt: Date, 
    updatedAt: Date
  } = {
    input: false,
    user: '', 
    warehouse: '', 
    type: '', 
    clientName: '', 
    hasClientEmail: false, 
    clientEmail: '', 
    clientPhone: '', 
    clientAddress: '', 
    product: '', 
    transactionQuantity: 0, 
    buyingPrice: 0, 
    sellingPrice: 0, 
    amount: 0, 
    packaging: '', 
    currency: '', 
    paymentMethod: '', 
    otherPaymentMethod: '', 
    agent: '', 
    cashed: false, 
    code: '', 
    createdAt: new Date(), 
    updatedAt: new Date()
  };
  
  displayedColumns: string[] = ['code', 'type', 'owner', 'agent', 'office', 'client', 'products', 'quantity_unit', 'price_unit', 'amount', 'edit', 'changeStatus', 'print', 'cashed'];
  dataSource: MatTableDataSource<Transaction>;

  codeFilter = new FormControl();
  ownerFilter = new FormControl();
  agentFilter = new FormControl();
  warehouseFilter = new FormControl();
  productFilter = new FormControl();
  
  filteredValues =
  {
    code: '',
    owner: '',
    agent: '',
    warehouse: '',
    product: ''
  };

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private apollo: Apollo,
    public dialog: MatDialog) { 
      this.dataSource = new MatTableDataSource(this.transactions);
      this.dataSource.filterPredicate = this.customFilterPredicate();
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

      this.codeFilter.valueChanges.subscribe((codeFilterValue) => {
        this.filteredValues['code'] = codeFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

      this.ownerFilter.valueChanges.subscribe((ownerFilterValue) => {
        this.filteredValues['owner'] = ownerFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

      this.agentFilter.valueChanges.subscribe((agentFilterValue) => {
        this.filteredValues['agent'] = agentFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

      this.productFilter.valueChanges.subscribe((productFilterValue) => {
        this.filteredValues['product'] = productFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

      this.warehouseFilter.valueChanges.subscribe((warehouseFilterValue) => {
        this.filteredValues['warehouse'] = warehouseFilterValue;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

      this.dataSource.filterPredicate = this.customFilterPredicate();
    });
  }

  customFilterPredicate()
  {
    const myFilterPredicate = function(data: Transaction, filter: string): boolean
    {
      let searchString = JSON.parse(filter);

      return data.code.toString().trim().indexOf(searchString.code) !== -1
        && data.user.name.toString().trim().indexOf(searchString.owner) !== -1
        && data.agent.name.toString().trim().indexOf(searchString.agent) !== -1
        && (data.warehouse.name.toString().trim().indexOf(searchString.product) !== -1 || data.warehouse.city.toString().trim().indexOf(searchString.product) !== -1 || data.warehouse.country.toString().trim().indexOf(searchString.product) !== -1)
        && (data.product.productCategory.name.toString().trim().indexOf(searchString.product) !== -1 || data.product.brand.name.toString().trim().indexOf(searchString.product) !== -1 || data.product.specs.toString().trim().indexOf(searchString.product) !== -1)
    }

    return myFilterPredicate;
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

  exportCsv(){
    let $transactions = [];

    this.transactions.map(transaction => {
      let $transaction = {...this.$transaction};
      $transaction.input = transaction.input;
      $transaction.user = transaction.user.name;
      $transaction.warehouse = transaction.warehouse.name + ' ' + transaction.warehouse.city + ' ' + transaction.warehouse.country;
      $transaction.type = transaction.type;
      $transaction.clientName = transaction.clientName;
      $transaction.hasClientEmail = transaction.hasClientEmail;
      $transaction.clientEmail = transaction.clientEmail;
      $transaction.clientPhone = transaction.clientPhone;
      $transaction.clientAddress = transaction.clientAddress;
      $transaction.product = transaction.product.productCategory.name + ' ' + transaction.product.brand.name + ' ' + transaction.product.specs;
      $transaction.transactionQuantity = transaction.transactionQuantity;
      $transaction.buyingPrice = transaction.buyingPrice;
      $transaction.sellingPrice = transaction.sellingPrice;
      $transaction.amount = transaction.amount;
      $transaction.packaging = transaction.packaging;
      $transaction.currency = transaction.currency;
      $transaction.paymentMethod = transaction.paymentMethod;
      $transaction.otherPaymentMethod = transaction.otherPaymentMethod;
      $transaction.agent = transaction.agent.name;
      $transaction.cashed = transaction.cashed;
      $transaction.code = transaction.code;
      $transaction.createdAt = new Date(parseInt(transaction.createdAt.toString()));
      $transaction.updatedAt = new Date(parseInt(transaction.updatedAt.toString()));
      $transactions.push($transaction);
    });

    var options = {
      fieldSeparator: ',',
      showLabels: true,
      headers: ['input', 
      'user', 
      'warehouse', 
      'type', 
      'clientName', 
      'hasClientEmail', 
      'clientEmail', 
      'clientPhone', 
      'clientAddress', 
      'product', 
      'transactionQuantity', 
      'buyingPrice', 
      'sellingPrice', 
      'amount', 
      'packaging', 
      'currency', 
      'paymentMethod', 
      'otherPaymentMethod', 
      'agent', 
      'cashed', 
      'code', 
      'createdAt', 
      'updatedAt']
    }

    new ngxCsv($transactions,'all-transactions', options);
  }
}

