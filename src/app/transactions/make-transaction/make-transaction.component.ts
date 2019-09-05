import { Component, OnInit, ViewChild } from '@angular/core';
import { Product, Warehouse, PaymentMethod, Transaction, Agent } from 'app/types';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { GET_TRANSACTIONS, ADD_TRANSACTION } from 'app/services/transactions.graphql';
import { map } from 'rxjs/operators';
import { GET_WAREHOUSES } from 'app/services/warehouses.graphql';
import { GET_PAYMENT_METHODS } from 'app/services/payment-methods.graphql';
import { GET_AGENTS } from 'app/services/agents.graphql';
import { GET_PRODUCTS_BY_WAREHOUSE, UPDATE_PRODUCT, REFRESH_PRODUCT } from 'app/services/products.graphql';
import { AuthService } from 'app/login/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-make-transaction',
  templateUrl: './make-transaction.component.html',
  styleUrls: ['./make-transaction.component.scss']
})
export class MakeTransactionComponent implements OnInit {

  transactions: Transaction[];
  transaction: Transaction;
  products: Product[];
  warehouses: Warehouse[];
  warehouse: Warehouse;
  paymentMethods: PaymentMethod[];
  agents: Agent[];
  firstTransactionForm: FormGroup;
  secondTransactionForm: FormGroup;
  thirdTransactionForm: FormGroup;
  fourthTransactionForm: FormGroup;
  displayedColumnsInput: string[] = ['product', 'stockQuantity', 'transactionQuantity', 'buyingPrice', 'select', 'amount'];
  displayedColumnsOutput: string[] = ['product', 'stockQuantity', 'transactionQuantity', 'sellingPrice', 'select', 'amount', 'commercialAction'];
  selectedProduct: Product;
  transactionQuantity = 0;
  buyingPrice = 0;
  sellingPrice = 0;
  amount = 0;

  @ViewChild('t1form', {static: true}) firstTransactionFormDirective;
  @ViewChild('t2form', {static: true}) secondTransactionFormDirective;
  @ViewChild('t3form', {static: true}) thirdTransactionFormDirective;
  @ViewChild('t4form', {static: true}) fourthTransactionFormDirective;

  constructor(private apollo: Apollo,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  createForm() {
    this.firstTransactionForm = this.fb.group({
      input: ['', Validators.required]
    });
    this.secondTransactionForm = this.fb.group({
      warehouseId: ['', Validators.required],
      type: [''],
      clientName: [''],
      hasClientEmail: ['', Validators.required],
      clientEmail: [''],
      clientPhone: [''],
      clientAddress: ['']
    });
    this.thirdTransactionForm = this.fb.group({
      packaging: [''],
      transactionQuantity: [''],
      buyingPrice: [''],
      sellingPrice: [''],
      commercialAction: [false],
    });
    this.fourthTransactionForm = this.fb.group({
      paymentMethod: [''],
      otherPaymentMethod: [''],
      agentId: ['', Validators.required],
      cashed: [false]
    });
  }

  get input() { return this.firstTransactionForm.get('input'); }
  get warehouseId() { return this.secondTransactionForm.get('warehouseId'); }
  get type() { return this.secondTransactionForm.get('type'); }
  get clientName() { return this.secondTransactionForm.get('clientName'); }
  get hasClientEmail() { return this.secondTransactionForm.get('hasClientEmail'); }
  get clientEmail() { return this.secondTransactionForm.get('clientEmail'); }
  get clientPhone() { return this.secondTransactionForm.get('clientPhone'); }
  get clientAddress() { return this.secondTransactionForm.get('clientAddress'); }
  get packaging() { return this.thirdTransactionForm.get('packaging'); }
  get transactionQuantityControl() { return this.thirdTransactionForm.get('transactionQuantity'); }
  get buyingPriceControl() { return this.thirdTransactionForm.get('buyingPrice'); }
  get sellingPriceControl() { return this.thirdTransactionForm.get('sellingPrice'); }
  get commercialAction() { return this.thirdTransactionForm.get('commercialAction'); }
  get paymentMethod() { return this.fourthTransactionForm.get('paymentMethod'); }
  get otherPaymentMethod() { return this.fourthTransactionForm.get('otherPaymentMethod'); }
  get agentId() { return this.fourthTransactionForm.get('agentId'); }
  get cashed() { return this.fourthTransactionForm.get('cashed'); }

  ngOnInit() {
    this.createForm();

    this.apollo.watchQuery({
      query: GET_TRANSACTIONS
    })
    .valueChanges.pipe(map((result: any) => result.data.getTransactions))
    .subscribe(data => this.transactions = data);

    this.apollo.watchQuery({
      query: GET_WAREHOUSES
    })
    .valueChanges.pipe(map((result: any) => result.data.getWarehouses))
    .subscribe(data => this.warehouses = data);

    this.apollo.watchQuery({
      query: GET_PAYMENT_METHODS
    })
    .valueChanges.pipe(map((result: any) => result.data.getPaymentMethods))
    .subscribe(data => this.paymentMethods = data);

    this.apollo.watchQuery({
      query: GET_AGENTS
    })
    .valueChanges.pipe(map((result: any) => result.data.getAgents))
    .subscribe(data => this.agents = data);
  }

  selectProduct(product: Product) {
    this.products.map(product => product.isSelected = false);
    this.selectedProduct = product;
    this.buyingPrice = this.thirdTransactionForm.value.buyingPrice;
    this.sellingPrice = this.thirdTransactionForm.value.sellingPrice;
    this.transactionQuantity = this.thirdTransactionForm.value.transactionQuantity;
    if (this.firstTransactionForm.value.input) {
      this.amount = this.transactionQuantity * this.buyingPrice;
    } else {
      this.amount = this.transactionQuantity * this.sellingPrice;
    }
    this.thirdTransactionForm.controls['transactionQuantity'].reset();
    this.thirdTransactionForm.controls['buyingPrice'].reset();
    this.thirdTransactionForm.controls['sellingPrice'].reset();
    product.isSelected = true;
  }

  deselectProduct(product: Product) {
    this.products.map(product => product.isSelected = false);
    this.selectedProduct = null;
    this.buyingPrice = 0;
    this.sellingPrice = 0;
    this.transactionQuantity = 0;
    this.amount = 0;
    this.thirdTransactionForm.controls['transactionQuantity'].reset();
    this.thirdTransactionForm.controls['buyingPrice'].reset();
    this.thirdTransactionForm.controls['sellingPrice'].reset();
    product.isSelected = false;
  }

  selectWarehouse(warehouse: Warehouse) {
    this.apollo.watchQuery({
      query: GET_PRODUCTS_BY_WAREHOUSE,
      variables: {
        warehouseId: this.secondTransactionForm.value.warehouseId
      }
    })
    .valueChanges.pipe(map((result: any) => result.data.getProductsByWarehouse))
    .subscribe(data => { 
      this.products = data.filter(product => product.isDeleted === false);
      this.products.map(product => {
        product.isSelected = false;
        this.products.filter(product => product.isDeleted === false);
      });
    });
    this.buyingPrice = 0;
    this.sellingPrice = 0;
    this.transactionQuantity = 0;
    this.amount = 0;
    this.warehouse = warehouse;
    this.thirdTransactionForm.controls['transactionQuantity'].reset();
    this.thirdTransactionForm.controls['buyingPrice'].reset();
    this.thirdTransactionForm.controls['sellingPrice'].reset();
    this.selectedProduct = null;
  }

  save() {
    this.apollo.mutate({
      mutation: UPDATE_PRODUCT,
      variables: {
        id: this.selectedProduct.id,
        productCategoryId: this.selectedProduct.productCategory.id,
        brandId: this.selectedProduct.brand.id,
        warehouseId: this.selectedProduct.warehouse.id,
        specs: this.selectedProduct.specs,
        unit: this.selectedProduct.unit,
        stockQuantity: this.firstTransactionForm.value.input ? this.selectedProduct.stockQuantity + this.transactionQuantity : this.selectedProduct.stockQuantity - this.transactionQuantity,
      },
      refetchQueries: ['getTransactions', 'getProducts', 'getWarehouses', 'getAgents']
    })
    .subscribe();

    let warehouse_inits = this.warehouse.name.split('', 2);
    let city_inits = this.warehouse.city.split('', 2);
    let country_inits = this.warehouse.country.split('', 2);

    let code = 'T' + (country_inits[0] + country_inits[1] + city_inits[0] + city_inits[1] + warehouse_inits[0] + warehouse_inits[1] + (this.transactions.length + 1).toLocaleString('en-US', {minimumIntegerDigits: 6, useGrouping:false})).toUpperCase();

    this.apollo.mutate({
      mutation: ADD_TRANSACTION,
      variables: {
        input: this.firstTransactionForm.value.input,
        userId: this.authService.getUserId(),
        warehouseId: this.secondTransactionForm.value.warehouseId,
        type: this.secondTransactionForm.value.type ? this.secondTransactionForm.value.type : '',
        clientName: this.secondTransactionForm.value.clientName ? this.secondTransactionForm.value.clientName : '',
        hasClientEmail: this.secondTransactionForm.value.hasClientEmail,
        clientEmail: this.secondTransactionForm.value.clientEmail ? this.secondTransactionForm.value.clientEmail : '',
        clientPhone: this.secondTransactionForm.value.clientPhone ? this.secondTransactionForm.value.clientPhone : '',
        clientAddress: this.secondTransactionForm.value.clientAddress ? this.secondTransactionForm.value.clientAddress : '',
        productId: this.selectedProduct.id,
        transactionQuantity: this.transactionQuantity,
        buyingPrice: this.firstTransactionForm.value.input ? this.buyingPrice : 0,
        sellingPrice: !this.firstTransactionForm.value.input && !this.thirdTransactionForm.value.commercialAction  ? this.sellingPrice : 0,
        amount: this.amount,
        packaging: this.thirdTransactionForm.value.packaging ? this.thirdTransactionForm.value.packaging : '',
        currency: this.warehouse.currency.name,
        paymentMethod: this.fourthTransactionForm.value.paymentMethod ? this.fourthTransactionForm.value.paymentMethod : '',
        otherPaymentMethod: this.fourthTransactionForm.value.otherPaymentMethod ? this.fourthTransactionForm.value.otherPaymentMethod : '',
        agentId: this.fourthTransactionForm.value.agentId,
        cashed: !this.firstTransactionForm.value.input ? this.fourthTransactionForm.value.cashed : false,
        code: code
      }, refetchQueries: ['getTransactions', 'getProducts', 'getWarehouses', 'getAgents']
    })
    .subscribe();

    this.amount = 0;
    this.firstTransactionFormDirective.resetForm();
    this.secondTransactionFormDirective.resetForm();
    this.thirdTransactionFormDirective.resetForm();
    this.firstTransactionFormDirective.resetForm();

    this.router.navigate(['my-transactions']);
  }

}
