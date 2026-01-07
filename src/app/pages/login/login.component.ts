import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GlobalProperties } from '../../shared/globalProperties';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: any = FormGroup;
  form_Builder: any = inject(FormBuilder);
  private _user = inject(UserService);
  private_router: any = inject(Router);
  private _toastr: any = inject(ToastrService);


  ngOnInit(): void {
    this.loginForm = this.form_Builder.group({
      username: ['', [Validators.required, Validators.pattern(GlobalProperties.nameRegex)]],
      // email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.email]],
    })
  }

  onLogin() {
    const formData = this.loginForm.value;
    const username = formData.username;
    const password = formData.password;
    console.log('Login Attempt:', { username, password });
    this._user.getUsers().subscribe({
      next: (res: any) => {
        let validUser = res.find(user => user.username === username && user.password === password);
        if (validUser) {
          this._user.storeCredentials(username, password);
          this._toastr.success('Welcome to Cashbook ', 'Success', GlobalProperties.toastrconfig);
          this.private_router.navigate(['/dashboard']);
        } else {
          this._toastr.error('Invalid username or password', 'Login Failed', GlobalProperties.toastrconfig);
        }
      },
      error: (err: any) => {
        this._toastr.error(GlobalProperties.genericErrorMessage, 'Error', GlobalProperties.toastrconfig);
      }

    })
  }


}
