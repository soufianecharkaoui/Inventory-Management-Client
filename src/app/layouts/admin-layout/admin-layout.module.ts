import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import {MatButtonModule} from '@angular/material/button';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { TransactionsComponent } from '../../transaction/transactions/transactions.component';
import { MakeTransactionComponent } from '../../transaction/make-transaction/make-transaction.component';
import { CurrenciesComponent, CRUDCurrencies } from '../../setup/currencies/currencies.component';
import { WarehousesComponent } from '../../setup/warehouses/warehouses.component';
import { BrandsComponent, CRUDBrands } from '../../setup/brands/brands.component';
import { ProductCategoriesComponent, CRUDProductCategories } from '../../setup/product-categories/product-categories.component';
import { ProductsComponent, CRUDProducts } from '../../setup/products/products.component';
import { UsersComponent } from '../../setup/users/users.component';
import { AgentsComponent, CRUDAgents } from '../../setup/agents/agents.component';
import { PaymentMethodsComponent, CRUDPaymentMethods } from '../../setup/payment-methods/payment-methods.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatListModule
  ],
  declarations: [ 
    DashboardComponent, 
    TransactionsComponent, 
    MakeTransactionComponent, 
    CurrenciesComponent, 
    WarehousesComponent, 
    BrandsComponent, 
    ProductCategoriesComponent, 
    ProductsComponent, 
    UsersComponent, 
    AgentsComponent, 
    PaymentMethodsComponent,
    CRUDAgents,
    CRUDBrands,
    CRUDCurrencies,
    CRUDPaymentMethods,
    CRUDProductCategories,
    CRUDProducts
  ],
  entryComponents: [
    CRUDAgents,
    CRUDBrands,
    CRUDCurrencies,
    CRUDPaymentMethods,
    CRUDProductCategories,
    CRUDProducts
  ],
})

export class AdminLayoutModule {}
