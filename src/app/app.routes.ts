import { Routes } from '@angular/router';
import { CustomersComponent } from './components/customers/customers.component';
import { NewCustomerComponent } from './components/new-customer/new-customer.component';
import { UpdateCustomerComponent } from './components/update-customer/update-customer.component';
import { NewAccountComponent } from './components/new-account/new-account.component';
import { UpdateAccountComponent } from './components/update-account/update-account.component';
import { NewTransactionComponent } from './components/new-transaction/new-transaction.component';

export const routes: Routes = [
    {path:'customers',component:CustomersComponent},
    {path:'newCustomer',component:NewCustomerComponent},
    {path:'updateCustomer',component:UpdateCustomerComponent},
    {path:'newAccount',component:NewAccountComponent},
    {path:'updateAccount',component:UpdateAccountComponent},
    {path:'newTransaction',component:NewTransactionComponent}
];
