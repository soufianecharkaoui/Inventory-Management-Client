import { Component, OnInit } from '@angular/core';
import { Transaction, Warehouse, Product } from 'app/types';
import { GET_TRANSACTIONS, GET_TRANSACTIONS_BY_WAREHOUSES } from 'app/services/transactions.graphql';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  warehousesTransactions: {warehouse: Warehouse, transactions: Transaction[]};

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_TRANSACTIONS_BY_WAREHOUSES
    })
    .valueChanges.pipe(map((result: any) => result.data.getTransactionsByWarehouses))
    .subscribe(data => this.warehousesTransactions = data);
  }

  getOverallIncome(warehouse) {
    let overallIncome = 0;
    warehouse.transactions.map(transaction => {
      overallIncome += transaction.sellingPrice - transaction.buyingPrice;
    });
    return overallIncome;
  }

  getOutputTransactions(warehouse) {
    let outputTransactions = warehouse.transactions.filter(transaction => transaction.input === false);
    return outputTransactions.length;
  }

  getProducts(transactions) {
    let $products = new Set(transactions.map(transaction => transaction.product));
    let products = Array.from($products);
    return products;
  }
  
  getSoldQuantity(transactions, product) {
    let soldQuantiy = 0;
    transactions = transactions.filter(transaction => transaction.input === false && transaction.product.id === product.id);
    transactions.map(transaction => {
      soldQuantiy += transaction.transactionQuantity;
    });
    return soldQuantiy;
  }

  getBoughtQuantity(transactions, product) {
    let boughtQuantiy = 0;
    transactions = transactions.filter(transaction => transaction.input === true && transaction.product.id === product.id);
    transactions.map(transaction => {
      boughtQuantiy += transaction.transactionQuantity;
    });
    return boughtQuantiy;
  }
}
