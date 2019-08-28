import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Transaction, Warehouse, PaymentMethod, Agent, Product } from 'app/types';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Apollo } from 'apollo-angular';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GET_TRANSACTIONS, DELETE_TRANSACTION, REVOKE_TRANSACTION, UPDATE_TRANSACTION } from 'app/services/transactions.graphql';
import { map } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'app/login/auth.service';
import { GET_WAREHOUSES } from 'app/services/warehouses.graphql';
import { GET_PAYMENT_METHODS } from 'app/services/payment-methods.graphql';
import { GET_AGENTS } from 'app/services/agents.graphql';
import { GET_PRODUCTS_BY_WAREHOUSE, UPDATE_PRODUCT, REFRESH_PRODUCT, GET_PRODUCTS_BY_TRANSACTION } from 'app/services/products.graphql';

@Component({
  selector: 'app-all-transactions',
  templateUrl: './all-transactions.component.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class AllTransactionsComponent implements OnInit {

  transactions: Transaction[];
  transaction: Transaction;
  products: Product[];
  
  displayedColumns: string[] = ['code', 'type', 'owner', 'agent', 'office', 'client', 'products', 'quantity_unit', 'price_unit', 'edit', 'changeStatus', 'print'];
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
      console.log(data);
      this.transactions = data;
      /*for (var i = 0; i < this.transactions.length; i++) {
        this.apollo.watchQuery({
          query: GET_PRODUCTS_BY_TRANSACTION,
          variables: {
            transactionId: this.transactions[i].id
          }
        })
        .valueChanges.pipe(map((result: any) => result.data.getProductsByTransaction))
        .subscribe(data2 => {
          this.products = data2;
        });
      }*/
      this.dataSource = new MatTableDataSource(this.transactions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

    this.apollo.watchQuery({
      query: GET_PRODUCTS_BY_TRANSACTION,
      variables: {
        transactionId: "5d66624e52b8272904a10787"
      }
    })
    .valueChanges.pipe(map((result: any) => result.data.getProductsByTransaction))
    .subscribe(data => console.log(data));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(transaction: Transaction) {
    const dialogRef = this.dialog.open(CRUDTransactions, {
      width: '300px',
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

@Component({
  selector: 'crud-transactions',
  templateUrl: 'crud-transactions.html',
  styleUrls: ['./all-transactions.component.scss']
})
export class CRUDTransactions implements OnInit{

  transactionForm: FormGroup;
  transaction: Transaction;
  transactions: Transaction[];
  warehouse: Warehouse;
  warehouses: Warehouse[];
  paymentMethods: PaymentMethod[];
  agents: Agent[];
  selectedProducts: Product[];
  products: Product[];
  totalAmount = 0;

  @ViewChild('tform', {static: true}) transactionFormDirective;

  constructor(
    public dialogRef: MatDialogRef<CRUDTransactions>,
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
      transactionQuantity: [this.data ? this.data.products.map(product => {return product.transactionQuantity;}) : ''],
      buyingPrice: [this.data ? this.data.products.map(product => {return product.buyingPrice;}) : ''],
      sellingPrice: [this.data ? this.data.products.map(product => {return product.sellingPrice;}) : ''],
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
  get transactionQuantity() { return this.transactionForm.get('transactionQuantity'); }
  get buyingPrice() { return this.transactionForm.get('buyingPrice'); }
  get sellingPrice() { return this.transactionForm.get('sellingPrice'); }
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
    this.selectedProducts.push(product);
    product.transactionQuantity = this.transactionForm.value.transactionQuantity;
    product.buyingPrice = this.transactionForm.value.buyingPrice;
    product.sellingPrice = this.transactionForm.value.sellingPrice;
    if (this.transactionForm.value.input) {
      product.amount = this.transactionForm.value.transactionQuantity * this.transactionForm.value.buyingPrice;
    } else {
      product.amount = this.transactionForm.value.transactionQuantity * this.transactionForm.value.sellingPrice;
    }
    this.totalAmount += product.amount;
    this.transactionForm.controls['transactionQuantity'].reset();
    this.transactionForm.controls['buyingPrice'].reset();
    this.transactionForm.controls['sellingPrice'].reset();
    product.isSelected = true;
  }

  deselectProduct(product: Product) {
    this.selectedProducts.map(prod => {
      if (prod.id === product.id) {
        if (this.selectedProducts.indexOf(prod) > -1) {
          this.selectedProducts.splice(this.selectedProducts.indexOf(prod), 1);
        }
      }
    });
    this.totalAmount -= product.amount;
    this.transactionForm.controls['transactionQuantity'].reset();
    this.transactionForm.controls['buyingPrice'].reset();
    this.transactionForm.controls['sellingPrice'].reset();
    product.transactionQuantity = 0;
    product.buyingPrice = 0;
    product.sellingPrice = 0;
    product.amount = 0;
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
        product.transactionQuantity = 0;
        product.buyingPrice = 0;
      product.sellingPrice = 0;
      product.amount = 0;
      product.isSelected = false;
      this.products.filter(product => product.isDeleted === false);
      });
    });
    this.warehouse = warehouse;
    this.totalAmount = 0;
    this.transactionForm.controls['transactionQuantity'].reset();
    this.transactionForm.controls['buyingPrice'].reset();
    this.transactionForm.controls['sellingPrice'].reset();
    this.selectedProducts = [];
  }

  updateStockQuantity(product: Product) {
    this.apollo.mutate({
      mutation: REFRESH_PRODUCT,
      variables: {
        id: product.id
      }
    })
    .subscribe(data => {
      product = data;
    });
    return product.stockQuantity;
  }

  save() {
    let productIds = [];
    this.selectedProducts.map(product => { 
      productIds.push(product.id);
      this.apollo.mutate({
        mutation: UPDATE_PRODUCT,
        variables: {
          id: product.id,
          productCategoryId: product.productCategory.id,
          brandId: product.brand.id,
          warehouseId: product.warehouse.id,
          specs: product.specs,
          unit: product.unit,
          stockQuantity: this.transactionForm.value.input ? this.updateStockQuantity(product) + product.transactionQuantity : this.updateStockQuantity(product) - product.transactionQuantity,
          transactionQuantity: product.transactionQuantity,
          buyingPrice: product.buyingPrice,
          sellingPrice: product.sellingPrice,
          amount: product.amount
        }
      })
      .subscribe();
    });
    
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
        productIds: productIds,
        packaging: this.transactionForm.value.packaging ? this.transactionForm.value.packaging : '',
        currency: this.warehouse.currency.name,
        totalAmount: this.totalAmount,
        paymentMethod: this.transactionForm.value.paymentMethod ? this.transactionForm.value.paymentMethod : '',
        otherPaymentMethod: this.transactionForm.value.otherPaymentMethod ? this.transactionForm.value.otherPaymentMethod : '',
        agentId: this.transactionForm.value.agentId,
        cashed: !this.transactionForm.value.input ? this.transactionForm.value.cashed : false,
        code: this.data.code
      },
      refetchQueries: ['getTransactions', 'getProducts', 'getProductsByWarehouse']
    })
    .subscribe();
  }

}
