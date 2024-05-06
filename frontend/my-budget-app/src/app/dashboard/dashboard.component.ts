import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppConstant } from '../app.constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  basicData: any={
    labels: [],
      datasets: [
       ]
  };
  monthlyData: any={
    labels: [],
      datasets: [
       ]
  };
  data: any = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
      },
    ],
  };
  budgets:any[]=[];
  expenses:any[]=[];
  labels:any[]=[];
  chartData:any[]=[];
  background:any[]=[];
  monthlyExpenseData: any[]=[];



    constructor(private http: HttpClient) {}

    ngAfterViewInit(): void {

    }
    ngOnInit() {
      this.getBudgetsAndPieG();
      this.getmonthlyExpensesChart();
    }



  getmonthlyExpensesChart() {
    this.http.get<any>(`${AppConstant.API_URL}/expenses/monthly`, { withCredentials: true }).subscribe(
      (data) => {
        this.monthlyExpenseData = data;
        const months = Object.keys(this.monthlyExpenseData);
    const expenses = Object.values(this.monthlyExpenseData);
        setTimeout(() =>{
          this.monthlyData = {
            labels: months,
            datasets: [
              {
                label: 'Monthly Expenses',
                data: expenses,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          }
        },1000)
      },
      (error) => {
        console.error('Error fetching monthly expense data:', error);
      }
    );
  }

    private getRandomColor(): string {

      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }


    getBudgetsAndPieG(){
    this.http.get<any[]>(`${AppConstant.API_URL}/budgets`,{withCredentials:true}).subscribe(
      (data) => {
        this.budgets = data;
        this.http.get<any[]>(`${AppConstant.API_URL}/expenses`,{withCredentials:true}).subscribe(
          (data) => {
            this.expenses = data;

        setTimeout(() =>{

        this.labels = this.budgets.map((budget) => budget.title);
        this.chartData = this.budgets.map((budget) => budget.amount);


        this.background = this.budgets.map(() => this.getRandomColor());
        this.data = {
          labels: this.labels,
          datasets: [
              {
                  data: this.chartData,
                  backgroundColor: this.background
              }
          ]
      };
  const groupedExpenseData: { [key: string]: number } = {};
  console.log(this.expenses)
  this.expenses.forEach((expense) => {
    if (groupedExpenseData[expense.category] === undefined) {
      groupedExpenseData[expense.category] = 0;
    }
    groupedExpenseData[expense.category] += expense.amount;
  });


  const expenseData = this.labels.map((budgetLabel) => groupedExpenseData[budgetLabel] || 0);
  const barWidth = 1;

  this.basicData = {
      labels: this.labels,
      datasets: [
        {
          label: 'Budget',
          data: this.chartData,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          barPercentage: barWidth,
        },
      ],
    }
        },1000)

      },
      (error) => {
        console.error('Error fetching expenses:', error);
      }
    );

        console.log(this.labels, this.chartData,this.background);
      },
      (error) => {
        console.error('Error fetching budgets:', error);
      }

    );

  }

}