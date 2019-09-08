import { MAT_DATE_FORMATS, DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Warehouse, PaymentMethod, Product, Transaction, Agent, Currency } from 'app/types';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { AuthService } from 'app/login/auth.service';
import { GET_TRANSACTIONS, UPDATE_TRANSACTION } from 'app/services/transactions.graphql';
import { map } from 'rxjs/operators';
import { GET_WAREHOUSES } from 'app/services/warehouses.graphql';
import { GET_PAYMENT_METHODS } from 'app/services/payment-methods.graphql';
import { GET_AGENTS } from 'app/services/agents.graphql';
import { GET_PRODUCTS_BY_WAREHOUSE, REFRESH_PRODUCT } from 'app/services/products.graphql';
import { GET_CURRENCIES } from 'app/services/currencies.graphql';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

export const CRUDTRANSACTION_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-crud-transactions',
  templateUrl: './crud-transactions.component.html',
  styleUrls: ['./crud-transactions.component.scss'],
  providers: [
    
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: CRUDTRANSACTION_FORMATS}
  ]
})
export class CRUDTransactionsComponent implements OnInit {

  transactionForm: FormGroup;
  transaction: Transaction;
  transactions: Transaction[];
  warehouse: Warehouse;
  warehouses: Warehouse[];
  paymentMethods: PaymentMethod[];
  agents: Agent[];
  currencies: Currency[];
  products: Product[];
  selectedProduct: Product;
  transactionQuantity = 0;
  buyingPrice = 0;
  sellingPrice = 0;
  amount = 0;
  displayedColumnsInput: string[] = ['product', 'stockQuantity', 'transactionQuantity', 'buyingPrice', 'select', 'amount'];
  displayedColumnsOutput: string[] = ['product', 'stockQuantity', 'transactionQuantity', 'sellingPrice', 'select', 'amount'];

  @ViewChild('tform', {static: true}) transactionFormDirective;

  constructor(
    public dialogRef: MatDialogRef<CRUDTransactionsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Transaction,
    private fb: FormBuilder,
    private apollo: Apollo,
    private authService: AuthService) {}

  createForm() {
    this.transactionForm = this.fb.group({
      agentId: [this.data ? this.data.agent.id : '', Validators.required],
      rfq: [''],
      bl: [''],
      input: [this.data ? this.data.input : '', Validators.required],
      warehouseId: [this.data ? this.data.warehouse.id : '', Validators.required],
      type: [this.data ? this.data.type : ''],
      clientName: [this.data ? this.data.clientName : ''],
      hasClientEmail: [this.data ? this.data.hasClientEmail : '', Validators.required],
      clientEmail: [this.data ? this.data.clientEmail : ''],
      clientPhone: [this.data ? this.data.clientPhone : ''],
      clientAddress: [this.data ? this.data.clientAddress : ''],
      packaging: [this.data ? this.data.packaging : ''],
      transactionQuantity: [this.data ? this.data.transactionQuantity : ''],
      buyingPrice: [this.data ? this.data.buyingPrice : ''],
      sellingPrice: [this.data ? this.data.sellingPrice : ''],
      paymentMethod: [this.data ? this.data.paymentMethod : ''],
      otherPaymentMethod: [this.data ? this.data.otherPaymentMethod : ''],
      cashed: [this.data ? this.data.cashed : false],
      chargementDate: [this.data ? new Date(Number(this.data.chargementDate)).toISOString() : ''],
      dechargementDate: [this.data ? new Date(Number(this.data.dechargementDate)).toISOString() : ''],
      warehouseReceiveDate: [this.data ? new Date(Number(this.data.warehouseReceiveDate)).toISOString() : ''],
      sellingDate: [this.data ? new Date(Number(this.data.sellingDate)).toISOString() : ''],
      numberCountainers: [this.data ? this.data.numberCountainers : ''],
      packagingPlanned: [this.data ? this.data.packagingPlanned : ''],
      packagingReceived: [this.data ? this.data.packagingReceived : ''],
      packagingDecharged: [this.data ? this.data.packagingDecharged : ''],
      missingPackaging: [this.data ? this.data.missingPackaging : ''],
      damagedPackaging: [this.data ? this.data.damagedPackaging : ''],
      emptyUnits: [this.data ? this.data.emptyUnits : ''],
      emptyRepackablePackaging: [this.data ? this.data.emptyRepackablePackaging : ''],
      damagedPackagingReconditionnable: [this.data ? this.data.damagedPackagingReconditionnable : ''],
      deviseId: [this.data ? this.data.devise.id : ''],
      dechargement: [this.data ? this.data.dechargement : ''],
      refundable: [this.data ? this.data.refundable : false],
      security: [this.data ? this.data.security : ''],
      penality: [this.data ? this.data.penality : ''],
      bonus: [this.data ? this.data.bonus : ''],
      comment: [this.data ? this.data.comment : ''],
      cost: [this.data ? this.data.cost : '']
    });
  }

  get input() { return this.transactionForm.get('input'); }
  get warehouseId() { return this.transactionForm.get('warehouseId'); }
  get type() { return this.transactionForm.get('type'); }
  get clientName() { return this.transactionForm.get('clientName'); }
  get hasClientEmail() { return this.transactionForm.get('hasClientEmail'); }
  get clientEmail() { return this.transactionForm.get('clientEmail'); }
  get clientPhone() { return this.transactionForm.get('clientPhone'); }
  get clientAddress() { return this.transactionForm.get('clientAddress'); }
  get packaging() { return this.transactionForm.get('packaging'); }
  get transactionQuantityControl() { return this.transactionForm.get('transactionQuantity'); }
  get buyingPriceControl() { return this.transactionForm.get('buyingPrice'); }
  get sellingPriceControl() { return this.transactionForm.get('sellingPrice'); }
  get paymentMethod() { return this.transactionForm.get('paymentMethod'); }
  get otherPaymentMethod() { return this.transactionForm.get('otherPaymentMethod'); }
  get agentId() { return this.transactionForm.get('agentId'); }
  get cashed() { return this.transactionForm.get('cashed'); }
  get rfq() { return this.transactionForm.get('rfq'); }
  get bl() { return this.transactionForm.get('bl'); }
  get chargementDate() { return this.transactionForm.get('chargementDate'); }
  get dechargementDate() { return this.transactionForm.get('dechargementDate'); }
  get warehouseReceiveDate() { return this.transactionForm.get('warehouseReceiveDate'); }
  get sellingDate() { return this.transactionForm.get('sellingDate'); }
  get numberCountainers() { return this.transactionForm.get('numberCountainers'); }
  get packagingPlanned() { return this.transactionForm.get('packagingPlanned'); }
  get packagingReceived() { return this.transactionForm.get('packagingReceived'); }
  get packagingDecharged() { return this.transactionForm.get('packagingDecharged'); }
  get missingPackaging() { return this.transactionForm.get('missingPackaging'); }
  get damagedPackaging() { return this.transactionForm.get('damagedPackaging'); }
  get emptyUnits() { return this.transactionForm.get('emptyUnits'); }
  get emptyRepackablePackaging() { return this.transactionForm.get('emptyRepackablePackaging'); }
  get damagedPackagingReconditionnable() { return this.transactionForm.get('damagedPackagingReconditionnable'); }
  get deviseId() { return this.transactionForm.get('deviseId'); }
  get dechargement() { return this.transactionForm.get('dechargement'); }
  get refundable() { return this.transactionForm.get('refundable'); }
  get security() { return this.transactionForm.get('security'); }
  get penality() { return this.transactionForm.get('penality'); }
  get bonus() { return this.transactionForm.get('bonus'); }
  get comment() { return this.transactionForm.get('comment'); }
  get cost() { return this.transactionForm.get('cost'); }

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

    this.apollo.watchQuery({
      query: GET_CURRENCIES
    })
    .valueChanges.pipe(map((result: any) => result.data.getCurrencies))
    .subscribe(data => this.currencies = data);
  }

  selectProduct(product: Product) {
    this.products.map(product => product.isSelected = false);
    this.selectedProduct = product;
    this.buyingPrice = this.transactionForm.value.buyingPrice;
    this.sellingPrice = this.transactionForm.value.sellingPrice;
    this.transactionQuantity = this.transactionForm.value.transactionQuantity;
    if (this.transactionForm.value.input) {
      this.amount = this.transactionQuantity * this.buyingPrice;
    } else {
      this.amount = this.transactionQuantity * this.sellingPrice;
    }
    this.transactionForm.controls['transactionQuantity'].reset();
    this.transactionForm.controls['buyingPrice'].reset();
    this.transactionForm.controls['sellingPrice'].reset();
    product.isSelected = true;
  }

  deselectProduct(product: Product) {
    this.products.map(product => product.isSelected = false);
    this.selectedProduct = null;
    this.buyingPrice = 0;
    this.sellingPrice = 0;
    this.transactionQuantity = 0;
    this.amount = 0;
    this.transactionForm.controls['transactionQuantity'].reset();
    this.transactionForm.controls['buyingPrice'].reset();
    this.transactionForm.controls['sellingPrice'].reset();
    product.isSelected = false;
  }

  selectWarehouse(warehouse: Warehouse) {
    this.apollo.watchQuery({
      query: GET_PRODUCTS_BY_WAREHOUSE,
      variables: {
        warehouseId: this.transactionForm.value.warehouseId
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
    this.transactionForm.controls['transactionQuantity'].reset();
    this.transactionForm.controls['buyingPrice'].reset();
    this.transactionForm.controls['sellingPrice'].reset();
    this.selectedProduct = null;
  }

  save() {
    this.apollo.mutate({
      mutation: REFRESH_PRODUCT,
      variables: {
        id: this.selectedProduct.id,
      }, refetchQueries: ['getTransactions', 'getProducts', 'getAgents', 'getWarehouses']
    })
    .subscribe();
    
    this.apollo.mutate({
      mutation: UPDATE_TRANSACTION,
      variables: {
        id: this.data.id,
        input: this.transactionForm.value.input,
        userId: this.authService.getUserId(),
        warehouseId: this.transactionForm.value.warehouseId,
        type: this.transactionForm.value.type ? this.transactionForm.value.type : '',
        clientName: this.transactionForm.value.clientName ? this.transactionForm.value.clientName : '',
        hasClientEmail: this.transactionForm.value.hasClientEmail,
        clientEmail: this.transactionForm.value.clientEmail ? this.transactionForm.value.clientEmail : '',
        clientPhone: this.transactionForm.value.clientPhone ? this.transactionForm.value.clientPhone : '',
        clientAddress: this.transactionForm.value.clientAddress ? this.transactionForm.value.clientAddress : '',
        productId: this.selectedProduct.id,
        transactionQuantity: this.transactionQuantity,
        buyingPrice: this.transactionForm.value.input ? this.buyingPrice : 0,
        sellingPrice: !this.transactionForm.value.input ? this.sellingPrice : 0,
        amount: this.amount,
        packaging: this.transactionForm.value.packaging ? this.transactionForm.value.packaging : '',
        currency: this.warehouse.currency.name,
        paymentMethod: this.transactionForm.value.paymentMethod ? this.transactionForm.value.paymentMethod : '',
        otherPaymentMethod: this.transactionForm.value.otherPaymentMethod ? this.transactionForm.value.otherPaymentMethod : '',
        agentId: this.transactionForm.value.agentId,
        cashed: !this.transactionForm.value.input ? this.transactionForm.value.cashed : false,
        code: this.data.code,
        rfq: this.transactionForm.value.rfq ? this.transactionForm.value.rfq : '',
        bl: this.transactionForm.value.bl ? this.transactionForm.value.bl : '',
        chargementDate: this.transactionForm.value.chargementDate ? this.transactionForm.value.chargementDate : '',
        dechargementDate: this.transactionForm.value.dechargementDate ? this.transactionForm.value.dechargementDate : '',
        warehouseReceiveDate: this.transactionForm.value.warehouseReceiveDate ? this.transactionForm.value.warehouseReceiveDate : '',
        sellingDate: this.transactionForm.value.sellingDate ? this.transactionForm.value.sellingDate : '',
        numberCountainers: this.transactionForm.value.numberCountainers ? this.transactionForm.value.numberCountainers : 0,
        packagingPlanned: this.transactionForm.value.packagingPlanned ? this.transactionForm.value.packagingPlanned : 0,
        packagingReceived: this.transactionForm.value.packagingReceived ? this.transactionForm.value.packagingReceived : 0,
        packagingDecharged: this.transactionForm.value.packagingDecharged ? this.transactionForm.value.packagingDecharged : 0,
        missingPackaging: this.transactionForm.value.missingPackaging ? this.transactionForm.value.missingPackaging : 0,
        damagedPackaging: this.transactionForm.value.damagedPackaging ? this.transactionForm.value.damagedPackaging : 0,
        emptyUnits: this.transactionForm.value.emptyUnits ? this.transactionForm.value.emptyUnits : 0,
        emptyRepackablePackaging: this.transactionForm.value.emptyRepackablePackaging ? this.transactionForm.value.emptyRepackablePackaging : 0,
        damagedPackagingReconditionnable: this.transactionForm.value.damagedPackagingReconditionnable ? this.transactionForm.value.damagedPackagingReconditionnable : 0,
        deviseId: this.transactionForm.value.deviseId ? this.transactionForm.value.deviseId : '//paste FCFA id here',
        dechargement: this.transactionForm.value.dechargement ? this.transactionForm.value.dechargement : '',
        refundable: this.transactionForm.value.Refundable ? this.transactionForm.value.refundable : false,
        security: this.transactionForm.value.security ? this.transactionForm.value.security : '',
        penality: this.transactionForm.value.penality ? this.transactionForm.value.penality : '',
        bonus: this.transactionForm.value.bonus ? this.transactionForm.value.bonus : '',
        comment: this.transactionForm.value.comment ? this.transactionForm.value.comment : '',
        cost: this.transactionForm.value.cost ? this.transactionForm.value.cost : 0
      }, refetchQueries: ['getTransactions', 'getProducts', 'getAgents', 'getWarehouses']
    })
    .subscribe();

    this.amount = 0;
    this.transactionFormDirective.resetForm();
    this.dialogRef.close();
  }

}
