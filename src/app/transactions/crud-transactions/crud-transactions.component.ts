import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Warehouse, PaymentMethod, Product, Transaction, Agent } from 'app/types';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { AuthService } from 'app/login/auth.service';
import { GET_TRANSACTIONS, UPDATE_TRANSACTION } from 'app/services/transactions.graphql';
import { map } from 'rxjs/operators';
import { GET_WAREHOUSES } from 'app/services/warehouses.graphql';
import { GET_PAYMENT_METHODS } from 'app/services/payment-methods.graphql';
import { GET_AGENTS } from 'app/services/agents.graphql';
import { GET_PRODUCTS_BY_WAREHOUSE, REFRESH_PRODUCT } from 'app/services/products.graphql';

@Component({
  selector: 'app-crud-transactions',
  templateUrl: './crud-transactions.component.html',
  styleUrls: ['./crud-transactions.component.scss']
})
export class CRUDTransactionsComponent implements OnInit {

  transactionForm: FormGroup;
  transaction: Transaction;
  transactions: Transaction[];
  warehouse: Warehouse;
  warehouses: Warehouse[];
  paymentMethods: PaymentMethod[];
  agents: Agent[];
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
      agentId: [this.data ? this.data.agent.id : '', Validators.required],
      cashed: [this.data ? this.data.cashed : false]
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
      }, refetchQueries: ['getTransactions', 'getProducts']
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
        code: this.data.code
      }, refetchQueries: ['getTransactions', 'getProducts']
    })
    .subscribe();

    this.amount = 0;
    this.transactionFormDirective.resetForm();
    this.dialogRef.close();
  }

}
