import { Currency } from './../types';
import { GET_AGENTS } from './../services/agents.graphql';
import { Component, OnInit } from '@angular/core';
import { Warehouse, Transaction, Product, Agent } from 'app/types';
import { map } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { GET_WAREHOUSES } from 'app/services/warehouses.graphql';
import { GET_CURRENCIES } from 'app/services/currencies.graphql';
import { GET_TRANSACTIONS } from 'app/services/transactions.graphql';
import { GET_PRODUCTS } from 'app/services/products.graphql';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  warehouses: Warehouse[];
  agents: Agent[];
  currencies: Currency[];
  transactions: Transaction[];
  products: Product[];

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_TRANSACTIONS
    })
    .valueChanges.pipe(map((result: any) => result.data.getTransactions))
    .subscribe(data => { 
      this.transactions = data;
    });

    this.apollo.watchQuery({
      query: GET_PRODUCTS
    })
    .valueChanges.pipe(map((result: any) => result.data.getProducts))
    .subscribe(data => { 
      this.products = data;
    });

    this.apollo.watchQuery({
      query: GET_WAREHOUSES
    })
    .valueChanges.pipe(map((result: any) => result.data.getWarehouses))
    .subscribe(data => this.warehouses = data);

    this.apollo.watchQuery({
      query: GET_AGENTS
    })
    .valueChanges.pipe(map((result: any) => result.data.getAgents))
    .subscribe(data => this.agents = data);

    this.apollo.watchQuery({
      query: GET_CURRENCIES
    })
    .valueChanges.pipe(map((result: any) => result.data.getCurrencies))
    .subscribe(data => this.currencies = data);
  }

  getBestSellingProduct(transactions: Transaction[]) {
    let $products = [];
    if (this.products) {
      this.products.map(product => {
        $products.push({product: product, soldQuantity: this.getSoldQuantity(transactions, product)});
      });
      $products.sort((a, b) => {return b.soldQuantity - a.soldQuantity});
    }
    return $products[0];
  }

  getLessSellingProduct(transactions: Transaction[]) {
    let $products = [];
    if (this.products) {
      this.products.map(product => {
        $products.push({product: product, soldQuantity: this.getSoldQuantity(transactions, product)});
      });
      $products.sort((a, b) => {return a.soldQuantity - b.soldQuantity});
    }
    return $products[0];
  }

  getOverallIncomeByWarehouse(warehouse: Warehouse) {
    let overallIncome = 0;
    warehouse.transactions.map(transaction => {
      transaction.input ? overallIncome -= transaction.amount : overallIncome += transaction.amount;
    });
    return overallIncome;
  }

  getOverallIncomeByAgent(agent: Agent) {
    let overallIncomeAndCurrency = [];
    if (this.currencies) {
      this.currencies.map(currency => {
        let overallIncome = 0;
        let transactions = agent.transactions.filter(transaction => transaction.warehouse.currency.id === currency.id);
        transactions.map(transaction => {
          transaction.input ? overallIncome -= transaction.amount : overallIncome += transaction.amount;
        });
        overallIncomeAndCurrency.push({overallIncome: overallIncome, currency: currency.name});
      });
    }
    return overallIncomeAndCurrency;
  }

  getOutputTransactions(transactions: Transaction[]) {
    let outputTransactions = transactions.filter(transaction => transaction.input === false);
    return outputTransactions.length;
  }

  getProducts(transactions: Transaction[]) {
    let $products = new Set(transactions.map(transaction => transaction.product));
    let products = Array.from($products);
    return products;
  }
  
  getSoldQuantity(transactions: Transaction[], product: Product) {
    let soldQuantity = 0;
    transactions = transactions.filter(transaction => transaction.input === false && transaction.product.id === product.id);
    transactions.map(transaction => {
      soldQuantity += transaction.transactionQuantity;
    });
    return soldQuantity;
  }

  getBoughtQuantity(transactions: Transaction[], product: Product) {
    let boughtQuantity = 0;
    transactions = transactions.filter(transaction => transaction.input === true && transaction.product.id === product.id);
    transactions.map(transaction => {
      boughtQuantity += transaction.transactionQuantity;
    });
    return boughtQuantity;
  }

  getAveragePrice(transactions: Transaction[], product: Product) {
    let averagePrice = 0;
    transactions = transactions.filter(transaction => transaction.product.id === product.id);
    transactions.map(transaction => {
      transaction.input ? averagePrice += transaction.buyingPrice :  averagePrice += transaction.sellingPrice;
    });
    return averagePrice / transactions.length;
  }
}
