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
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
const moment = _rollupMoment || _moment;
import { FormControl } from '@angular/forms';

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
  month = -1;
  year = -1;

  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.year = ctrlValue.year();
    this.transactions.filter(transaction => new Date(Number(transaction.createdAt)).getFullYear() === this.year);
    this.warehouses.map(warehouse => {
      warehouse.transactions = warehouse.transactions.filter(transaction => new Date(Number(transaction.createdAt)).getFullYear() === this.year);
    });
    this.agents.map(agent => {
      agent.transactions = agent.transactions.filter(transaction => new Date(Number(transaction.createdAt)).getFullYear() === this.year);
    });
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.month = ctrlValue.month();
    this.transactions = this.transactions.filter(transaction => new Date(Number(transaction.createdAt)).getMonth() === this.month);
    this.warehouses.map(warehouse => {
      warehouse.transactions = warehouse.transactions.filter(transaction => new Date(Number(transaction.createdAt)).getMonth() === this.month);
    });
    this.agents.map(agent => {
      agent.transactions = agent.transactions.filter(transaction => new Date(Number(transaction.createdAt)).getMonth() === this.month);
    });
    console.log(this.transactions);
  }


  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.apollo.watchQuery({
      query: GET_TRANSACTIONS
    })
    .valueChanges.pipe(map((result: any) => result.data.getTransactions))
    .subscribe(data => this.transactions = data);

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
    .subscribe(data => this.warehouses = data.filter(warehouse => warehouse.isDeleted === false));

    this.apollo.watchQuery({
      query: GET_AGENTS
    })
    .valueChanges.pipe(map((result: any) => result.data.getAgents))
    .subscribe(data => this.agents = data.filter(agent => agent.isDeleted === false));

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

  getTop10ProductsBySoldQuantity(transactions: Transaction[]) {
    let $products = [];
    if (this.products) {
      this.products.map(product => {
        $products.push({product: product, soldQuantity: this.getSoldQuantity(transactions, product)});
      });
      $products.sort((a, b) => {return b.soldQuantity - a.soldQuantity});
    }
    return $products.slice(0,10);
  }

  getBottom10ProductsBySoldQuantity(transactions: Transaction[]) {
    let $products = [];
    if (this.products) {
      this.products.map(product => {
        $products.push({product: product, soldQuantity: this.getSoldQuantity(transactions, product)});
      });
      $products.sort((a, b) => {return a.soldQuantity - b.soldQuantity});
    }
    return $products.slice(0,10);
  }

  getTop10ProductsByOverallIncome(transactions: Transaction[]) {
    let $products = [];
    if (this.products) {
      this.products.map(product => {
        $products.push({product: product, overallIncome: this.getOverallIncomeByProduct(product, transactions)});
      });
      $products.sort((a, b) => {return b.overallIncome - a.overallIncome});
    }
    return $products.slice(0,10);
  }

  getBottom10ProductsByOverallIncome(transactions: Transaction[]) {
    let $products = [];
    if (this.products) {
      this.products.map(product => {
        $products.push({product: product, overallIncome: this.getOverallIncomeByProduct(product, transactions)});
      });
      $products.sort((a, b) => {return a.overallIncome - b.overallIncome});
    }
    return $products.slice(0,10);
  }

  getOverallIncomeByWarehouse(warehouse: Warehouse) {
    let overallIncome = 0;
    warehouse.transactions.map(transaction => {
      transaction.input ? overallIncome -= transaction.amount : overallIncome += transaction.amount;
    });
    return overallIncome;
  }

  getOverallIncomeByProduct(product: Product, transactions: Transaction[]) {
    let overallIncome = 0
    transactions = transactions.filter(transaction => transaction.product.id === product.id);
    transactions.map(transaction => {
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
    let sumPrices = 0;
    let sumQuantities = 0;
    let averagePrice = 0;
    transactions = transactions.filter(transaction => transaction.input && transaction.product.id === product.id);
    transactions.map(transaction => {
      sumPrices += transaction.amount;
      sumQuantities += transaction.transactionQuantity;
    });
    averagePrice = Number(((sumPrices / sumQuantities).toFixed(2)));
    return isNaN(averagePrice) ? 0 : averagePrice;
  }

  getValueOfStock(product: Product) {
    return this.transactions ? (this.getAveragePrice(this.transactions, product) * product.stockQuantity).toFixed(2) : 0.00;
  }
}
