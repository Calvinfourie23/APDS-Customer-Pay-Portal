import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
import { CustomerDashboardComponent } from './components/customer-dashboard/customer-dashboard.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginFormComponent },
  { path: 'register', component: RegisterFormComponent },
  { 
    path: 'customer-dashboard', 
    component: CustomerDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'customer' }
  },
  { 
    path: 'employee-dashboard', 
    component: EmployeeDashboardComponent,
    canActivate: [RoleGuard],
    data: { role: 'employee' }
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    PaymentFormComponent,
    CustomerDashboardComponent,
    RegisterFormComponent,
    EmployeeDashboardComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
