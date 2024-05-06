import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AppConstant } from 'src/app/app.constants';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ["", [ Validators.required]],
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
    return this.registerForm.controls;
  }


  onRegister(): void {
    let user = this.registerForm.getRawValue();

    console.log(user);

    if (this.registerForm.valid) {

      this.http
        .post(`${AppConstant.API_URL}/register`, user, {
          withCredentials: true,
        })
        .subscribe(
          (user: any) => {
            alert('Success User registered successfully');
            localStorage.setItem('user', user.user);
            this.authService.isLoggedin=true;
            this.router.navigate(['/']);
          },
          (error) => {
            console.log(error);
            alert('Error');
          }
        );
    }
  }
}