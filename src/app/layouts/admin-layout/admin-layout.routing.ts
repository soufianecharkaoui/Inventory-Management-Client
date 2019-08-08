import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { WarehousesComponent } from 'app/setup/warehouses/warehouses.component';
import { AgentsComponent } from 'app/setup/agents/agents.component';
import { UsersComponent } from 'app/setup/users/users.component';
import { BrandsComponent } from 'app/setup/brands/brands.component';
import { ProductCategoriesComponent } from 'app/setup/product-categories/product-categories.component';
import { ProductsComponent } from 'app/setup/products/products.component';
import { TransactionsComponent } from 'app/transaction/transactions/transactions.component';
import { PaymentMethodsComponent } from 'app/setup/payment-methods/payment-methods.component';
import { CurrenciesComponent } from 'app/setup/currencies/currencies.component';
import { MakeTransactionComponent } from 'app/transaction/make-transaction/make-transaction.component';

export const AdminLayoutRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    }, {
        path: 'transactions',
        component: TransactionsComponent
    }, {
        path: 'make-transaction',
        component: MakeTransactionComponent
    }, {
        path: 'setup/warehouses',
        component: WarehousesComponent
    }, {
        path: 'setup/agents',
        component: AgentsComponent
    }, {
        path: 'setup/users',
          component: UsersComponent
    }, {
        path: 'setup/brands',
        component: BrandsComponent
    }, {
        path: 'setup/product-categories',
        component: ProductCategoriesComponent
    }, {
        path: 'setup/products',
        component: ProductsComponent
    }, {
        path: 'setup/payment-methods',
        component: PaymentMethodsComponent
    }, {
        path: 'setup/currencies',
        component: CurrenciesComponent
    }
];
