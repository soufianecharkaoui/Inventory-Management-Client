import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { Currency } from './../types';
import { Component, OnInit } from '@angular/core';
import { Warehouse, Transaction, Product, Agent } from 'app/types';
import { map, take } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { GET_CURRENCIES } from 'app/services/currencies.graphql';
import { GET_PRODUCTS, REFRESH_PRODUCTS } from 'app/services/products.graphql';
import {MatDatepicker} from '@angular/material/datepicker';
import * as _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
const moment = _rollupMoment || _moment;
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

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
  styleUrls: ['./dashboard.component.scss'],
  providers: [
    
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class DashboardComponent implements OnInit {

  $warehouses: Warehouse[];
  warehouses: Warehouse[];
  $agents: Agent[];
  agents: Agent[];
  currencies: Currency[];
  $transactions: Transaction[];
  transactions: Transaction[];
  products: Product[];
  month = -1;
  year = -1;
  isGlobal: boolean = true;
  revenue: number = 0;

  displayedColumnsAgents: string[] = ['agent', 'warehouses', 'products', 'quantitySold', 'valueSold', 'revenueByProduct'];
  displayedColumnsWarehouses: string[] = ['warehouse', 'products', 'quantityBought', 'averagePrice', 'quantitySold', 'valueSold', 'stock', 'valueStock', 'revenueByProduct'];

  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    this.year = ctrlValue.year();
    
    this.transactions = this.$transactions.filter(transaction => new Date(Number(transaction.createdAt)).getMonth() === this.month && new Date(Number(transaction.createdAt)).getFullYear() === this.year && transaction.isDeleted === false);

    this.warehouses = this.$warehouses.map($warehouse => {
      const warehouse ={...$warehouse}
      warehouse.transactions = $warehouse.transactions.filter(transaction => new Date(Number(transaction.createdAt)).getFullYear() === this.year && new Date(Number(transaction.createdAt)).getMonth() === this.month && transaction.isDeleted === false)
      return warehouse
    });

    this.agents = this.$agents.map($agent => {
      const agent ={...$agent}
      agent.transactions = $agent.transactions.filter(transaction => new Date(Number(transaction.createdAt)).getFullYear() === this.year && new Date(Number(transaction.createdAt)).getMonth() === this.month && transaction.isDeleted === false)
      return agent
    });
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.month = ctrlValue.month();

    this.transactions = this.$transactions.filter(transaction => new Date(Number(transaction.createdAt)).getMonth() === this.month && new Date(Number(transaction.createdAt)).getFullYear() === this.year && transaction.isDeleted === false);

    this.warehouses = this.$warehouses.map($warehouse => {
      const warehouse ={...$warehouse}
      warehouse.transactions = $warehouse.transactions.filter(transaction => new Date(Number(transaction.createdAt)).getFullYear() === this.year && new Date(Number(transaction.createdAt)).getMonth() === this.month && transaction.isDeleted === false)
      return warehouse
    });

    this.agents = this.$agents.map($agent => {
      const agent ={...$agent}
      agent.transactions = $agent.transactions.filter(transaction => new Date(Number(transaction.createdAt)).getFullYear() === this.year && new Date(Number(transaction.createdAt)).getMonth() === this.month && transaction.isDeleted === false)
      return agent
    });
  }


  constructor(private apollo: Apollo,
    activatedRoute: ActivatedRoute) { 
    this.$agents = activatedRoute.snapshot.data.data.agents;
    this.$warehouses = activatedRoute.snapshot.data.data.warehouses;
    this.$transactions = activatedRoute.snapshot.data.data.transactions;
    this.getGlobalStats();
  }

  getMoneyFormat(number) {

    // Nine Zeroes for Billions
    return Math.abs(Number(number)) >= 1.0e+9

    ? Number((number / 1.0e+9).toFixed(2)) + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(number)) >= 1.0e+6

    ? Number((number / 1.0e+6).toFixed(2)) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(number)) >= 1.0e+3

    ? Number((number / 1.0e+3).toFixed(2)) + "K"

    : Number(number.toFixed(2));
  }

  getGlobalStats() {
    if (this.isGlobal) {
      this.agents = this.$agents;
      this.warehouses = this.$warehouses;
      this.transactions = this.$transactions;
    } else {}
  }

  ngOnInit() {
    this.apollo.mutate({
      mutation: REFRESH_PRODUCTS, 
      refetchQueries: ['getTransactions', 'getProducts', 'getWarehouses', 'getAgents']
    })
    .subscribe();

    this.apollo.watchQuery({
      query: GET_PRODUCTS
    })
    .valueChanges.pipe(map((result: any) => this.products = result.data.getProducts))
    .subscribe(data => this.products = data);

    this.apollo.watchQuery({
      query: GET_CURRENCIES
    })
    .valueChanges.pipe(map((result: any) => {this.currencies = result.data.getCurrencies}), take(1))
  }

  getTotalValueOfTransactions(transactions: Transaction[]) {
    let value = 0;
    transactions.map(transaction => {
      value += transaction.amount; 
    });
    return [value, this.getMoneyFormat(value)];
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

  getTop10ProductsByRevenue(transactions: Transaction[]) {
    let $products = [];
    if (this.products) {
      this.products.map(product => {
        $products.push({product: product, revenue: this.getRevenueByProduct(product, transactions)[0]});
      });
      $products.sort((a, b) => {return b.revenue - a.revenue});
    }
    return $products.slice(0,10);
  }

  getRevenue(transactions: Transaction[], products: Product[]) {
    let revenue = 0;
    products.map(product => {
      const rev = this.getRevenueByProduct(product, transactions)[0];
      revenue += rev;
    });
    return isNaN(revenue) ? 0 : [revenue, this.getMoneyFormat(revenue)];;
  }

  getRevenueByProduct(product: Product, transactions: Transaction[]) {
    let sumSoldAmount = 0;
    this.revenue = 0;
    const $transactions = transactions.filter(transaction => transaction.product.id === product.id && transaction.input === false);
    $transactions.map(transaction => {
      sumSoldAmount += transaction.amount;
    });
    this.revenue = sumSoldAmount - ((isNaN(this.getAveragePrice(transactions, product)[0]) ? 0 : this.getAveragePrice(transactions, product)[0]) * this.getSoldQuantity($transactions, product));
    return isNaN(this.revenue) ? 0 : [this.revenue, this.getMoneyFormat(this.revenue)];
  }

  getOverallIncome(warehouse: Warehouse) {
    let overallIncome = 0;
    warehouse.transactions.map(transaction => {
      transaction.input ? overallIncome -= transaction.amount : overallIncome += transaction.amount;
    });
    return [overallIncome, this.getMoneyFormat(overallIncome)];
  }

  getOverallIncomeByProduct(product: Product, transactions: Transaction[]) {
    let overallIncome = 0
    transactions = transactions.filter(transaction => transaction.product.id === product.id);
    transactions.map(transaction => {
      transaction.input ? overallIncome -= transaction.amount : overallIncome += transaction.amount;
    });
    return [overallIncome, this.getMoneyFormat(overallIncome)];
  }

  getInputTransactions(transactions: Transaction[]) {
    let value = 0;
    let inputTransactions = transactions.filter(transaction => transaction.input === true);
    inputTransactions.map(transaction => {
      value += transaction.amount;
    });
    return { length: inputTransactions.length, value: [value, this.getMoneyFormat(value)] };
  }

  getOutputTransactions(transactions: Transaction[]) {
    let valueCashed = 0;
    let valueUncashed = 0;
    let outputTransactionsCashed = transactions.filter(transaction => transaction.input === false && transaction.cashed === true);
    let outputTransactionsUncashed = transactions.filter(transaction => transaction.input === false && transaction.cashed === false); 
    outputTransactionsCashed.map(transaction => {
      valueCashed += transaction.amount;
    });
    outputTransactionsUncashed.map(transaction => {
      valueUncashed += transaction.amount;
    });
    return { cashed: outputTransactionsCashed.length, valueCashed: [valueCashed, this.getMoneyFormat(valueCashed)], uncashed: outputTransactionsUncashed.length, valueUncashed: [valueUncashed, this.getMoneyFormat(valueUncashed)] };
  }

  getProducts(transactions: Transaction[]) {
    let $products = new Set(transactions.map(transaction => transaction.product));
    let products = Array.from($products);
    products.map(product => {
      if (this.products) {
        let _product = this.products.find($product => $product.id === product.id);
        product.stockQuantity = _product.stockQuantity;
      } else {}
    })
    return products;
  }

  getProductsByAgents(transactions: Transaction[]) {
    transactions = transactions.filter(transaction => transaction.input === false);
    let $products = new Set(transactions.map(transaction => transaction.product));
    let products = Array.from($products);
    return products;
  }

  getWarehouses(transactions: Transaction[]) {
    let $warehouses = new Set(transactions.map(transaction => transaction.warehouse));
    let warehouses = Array.from($warehouses);
    return warehouses;
  }
  
  getSoldQuantity(transactions: Transaction[], product: Product) {
    let soldQuantity = 0;
    transactions = transactions.filter(transaction => transaction.input === false && transaction.product.id === product.id);
    transactions.map(transaction => {
      soldQuantity += transaction.transactionQuantity;
    });
    return soldQuantity;
  }

  getValueSold(transactions: Transaction[], product: Product) {
    let valueSold = 0;
    transactions = transactions.filter(transaction => transaction.input === false && transaction.product.id === product.id);
    transactions.map(transaction => {
      valueSold += transaction.amount;
    });
    return [valueSold, this.getMoneyFormat(valueSold)];
  }

  getBoughtQuantity(transactions: Transaction[], product: Product) {
    let boughtQuantity = 0;
    transactions = transactions.filter(transaction => transaction.input === true && transaction.product.id === product.id);
    transactions.map(transaction => {
      boughtQuantity += transaction.transactionQuantity;
    });
    return boughtQuantity;
  }

  getValueBought(transactions: Transaction[], product: Product) {
    let valueBought = 0;
    transactions = transactions.filter(transaction => transaction.input === true && transaction.product.id === product.id);
    transactions.map(transaction => {
      valueBought += transaction.amount;
    });
    return [valueBought, this.getMoneyFormat(valueBought)];
  }

  getAveragePrice(transactions: Transaction[], product: Product) {
    let sumPrices = 0;
    let sumQuantities = 0;
    transactions = this.$transactions.filter(transaction => transaction.input === true && transaction.product.id === product.id);
    transactions.map(transaction => {
      sumPrices += transaction.amount;
      sumQuantities += transaction.transactionQuantity;
    });
    product.averagePrice = Number(((sumPrices / sumQuantities).toFixed(2)));
    return isNaN(product.averagePrice) ? 0 : [product.averagePrice, this.getMoneyFormat(product.averagePrice)];
  }

  getValueOfStock(product: Product) {
    let value = this.transactions ? (this.getAveragePrice(this.transactions, product)[0] * product.stockQuantity) : 0;
    return [value, this.getMoneyFormat(value)];
  }
}
