// app.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tokenExpirationWarning: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    setInterval(() => {
      const token = this.authService.getToken();
      if (token) {
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = tokenData.exp * 1000;
        const currentTime = Date.now();
        if (expirationTime - currentTime < 20000) { 
          this.tokenExpirationWarning = true;
          if(expirationTime - currentTime <=0){
            this.authService.logout()
            this.tokenExpirationWarning = false;
            this.logout()
          }
        }
      }
    }, 1000);
  }

  refreshToken(): void {
    const token = this.authService.getToken();
    const email= localStorage.getItem("email");
    if(token && email){    
      this.authService.refresh(token,email).subscribe(
        (Response:any)=>
        {
          this.authService.isLoggedin=true;
          this.tokenExpirationWarning=false;
        },(error)=>{
          console.log(error);
          alert("Error");
        }
        );
    }
  }

  logout(){
    this.authService.logout()
    localStorage.clear();
    this.tokenExpirationWarning=false;
    this.authService.isLoggedin=false;
    this.router.navigate(["/login"])
  
  }

  
}
