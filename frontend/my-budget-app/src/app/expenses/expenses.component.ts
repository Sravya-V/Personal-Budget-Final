import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AppConstant } from '../app.constants';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent {
  displayedColumns: string[] = [ 'category','amount',' ExpenseTitle', 'date','actions'];
  expenses: any[] = [];
  clonedExpenses:any[]=[];
  newExpense: any = {};
  budgets:any[]=[];
  categories:any[]=[];
  display:boolean=false;


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getBudgets();
    this.getExpenses();

  }

  getBudgets(): void {
    this.http.get<any[]>(`${AppConstant.API_URL}/budgets`,{withCredentials:true}).subscribe(
      (data) => {
        this.budgets = data;
        this.categories = this.budgets.map((budget) => budget.title);
        console.log('Budgets:', this.categories);
      },
      (error) => {
        console.error('Error fetching budgets:', error);
      }
    );
  }
  getExpenses(): void {
    this.http.get<any[]>(`${AppConstant.API_URL}/expenses`,{withCredentials:true}).subscribe(
      (data) => {
        this.expenses = data;
      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );
  }

  openExpenseDialog(): void {
  this.display=true
  }


  addExpense(newExpense: any): void {
    this.http.post<any>(`${AppConstant.API_URL}/expenses`, newExpense,{withCredentials:true}).subscribe(
      (data) => {
        console.log('Expense added successfully:', data);
        this.getExpenses();
      },
      (error) => {
        console.error('Error adding expense:', error);
      }
    );
  }


  onRowEditInit(expense: any,id:any) {
    this.clonedExpenses[id] = {...expense};
}

onRowEditSave(expense: any,id:any) {

        delete this.clonedExpenses[id];
        this.http.put<any>(`${AppConstant.API_URL}/expenses/${expense._id}`, expense, { withCredentials: true })
      .subscribe(
        (data) => {
          console.log('Expense updated successfully:', data);
          this.getExpenses();
        },
        (error) => {
          console.error('Error updating expense:', error);
        }
      );

}

onRowEditCancel(budget: any, index: number) {
    this.expenses[index] = this.clonedExpenses[index];
     delete this.clonedExpenses[index];
}

onRowDelete(rowData:any,ri:any){
  this.http.delete(`${AppConstant.API_URL}/expenses/${rowData._id}`, {withCredentials:true}).subscribe(() => {
    this.getExpenses();
}
  );
}
}