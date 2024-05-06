import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';


import { AuthGuard } from './auth/auth.guard';
import { BudgetComponent } from './budget/budget.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { RegisterComponent } from './register/register.component';
const routes: Routes = [
  {
    path:'',component:HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path:'login',component:LoginComponent,

  },
  {
    path:'register',component:RegisterComponent
  },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard]
  } ,
   {
    path: 'budget', component: BudgetComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'expenses', component: ExpensesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }