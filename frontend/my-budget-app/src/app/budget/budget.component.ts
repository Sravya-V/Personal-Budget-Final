import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppConstant } from '../app.constants';

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent {
  budgets: any[] = [];
  clonedBudgets:any[]=[];
  newBudget: any = { title: '', amount: 0 };
  dialog: boolean=false;;
  titles=["Entertainment","Food","Groceries","Rent","Travel","Fees","Insurance","Others"]
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getBudgets();
  }


  openAddBudgetDialog(): void {
   this.dialog=true;
  }


  addBudget(newBudget: any) {

    this.http.post(`${AppConstant.API_URL}/budgets`, newBudget, {withCredentials:true}).subscribe(() => {
      this.getBudgets();
      this.newBudget={ title: '', amount: 0 };
      this.dialog=false;
    });
  }

  getBudgets(): void {
    this.http.get<any[]>(`${AppConstant.API_URL}/budgets`,{withCredentials:true}).subscribe(
      (data) => {
        this.budgets = data;
        console.log('Budgets:', this.budgets);
      },
      (error) => {
        console.error('Error fetching budgets:', error);
      }
    );
  }
  


  deleteBudget(budgetId: string) {
    this.http.delete(`${AppConstant.API_URL}/budgets/${budgetId}`, {withCredentials:true}).subscribe(() => {
      this.getBudgets();
    });
  }
  onRowEditInit(budget: any,id:any) {
        this.clonedBudgets[id] = {...budget};
    }

    onRowEditSave(budget: any,id:any) {

            delete this.clonedBudgets[id];
            this.http.put(`${AppConstant.API_URL}/budgets/${budget._id}`, budget, { withCredentials: true }).subscribe(() => {
      this.getBudgets();
    });

    }

    onRowEditCancel(budget: any, index: number) {
        this.budgets[index] = this.clonedBudgets[index];
         delete this.clonedBudgets[index];
    }

    onRowDelete(rowData:any,ri:any){
      this.http.delete(`${AppConstant.API_URL}/budgets/${rowData._id}`, {withCredentials:true}).subscribe(() => {
        this.getBudgets();
    }
      );
    }

}