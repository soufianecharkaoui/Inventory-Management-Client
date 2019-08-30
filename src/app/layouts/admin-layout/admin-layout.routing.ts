import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { WarehousesComponent } from 'app/setup/warehouses/warehouses.component';
import { AgentsComponent } from 'app/setup/agents/agents.component';
import { UsersComponent } from 'app/setup/users/users.component';
import { BrandsComponent } from 'app/setup/brands/brands.component';
import { ProductCategoriesComponent } from 'app/setup/product-categories/product-categories.component';
import { ProductsComponent } from 'app/setup/products/products.component';
import { PaymentMethodsComponent } from 'app/setup/payment-methods/payment-methods.component';
import { CurrenciesComponent } from 'app/setup/currencies/currencies.component';
import { MakeTransactionComponent } from 'app/transactions/make-transaction/make-transaction.component';
import { MyTransactionsComponent } from 'app/transactions/my-transactions/my-transactions.component';
import { AllTransactionsComponent } from 'app/transactions/all-transactions/all-transactions.component';
import { AuthGuardService as AuthGuard } from 'app/login/auth-guard.service';

export const AdminLayoutRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'make-transaction',
        component: MakeTransactionComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'my-transactions',
        component: MyTransactionsComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'all-transactions',
        component: AllTransactionsComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'setup/warehouses',
        component: WarehousesComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'setup/agents',
        component: AgentsComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'setup/users',
        component: UsersComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'setup/brands',
        component: BrandsComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'setup/product-categories',
        component: ProductCategoriesComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'setup/products',
        component: ProductsComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'setup/payment-methods',
        component: PaymentMethodsComponent,
        canActivate: [AuthGuard]
    }, {
        path: 'setup/currencies',
        component: CurrenciesComponent,
        canActivate: [AuthGuard]
    }
];
