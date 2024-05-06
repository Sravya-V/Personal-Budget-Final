import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstant } from 'src/app/app.constants';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  public loginForm!: FormGroup;
  public submitted = false;

  constructor( private formBuilder: FormBuilder, private router: Router,    private http: HttpClient,    private authService : AuthService,

    ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.email, Validators.required]],
      password: [
        "",
        [
          Validators.required,
          Validators.pattern(
            "(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@$!#^~%*?&,.<>\"'\\;:{\\}\\[\\]\\|\\+\\-\\=\\_\\)\\(\\)\\`\\/\\\\\\]])[A-Za-z0-9d$@].{7,}"
          )
        ]
      ]
    });
  }

  get formControl() {
    return this.loginForm.controls;
  }

  onLogin(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      let user=this.loginForm.getRawValue()
      this.authService.login(user['email'],user['password'])
      .subscribe(
        (Response:any)=>
        {
          localStorage.setItem("user",user);
          localStorage.setItem("email",user['email'])
          this.authService.isLoggedin=true;
          this.router.navigate(['/']);
        },(error)=>{
          console.log(error);
          alert("Error");
        }
        );
    }
  }
}