import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { GlobalProperties } from '../../shared/globalProperties';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  registerForm: any = FormGroup;
  formBuilder = inject(FormBuilder);
  private _userService = inject(UserService);
  private _toastrService = inject(ToastrService);
  private _router = inject(Router);

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(GlobalProperties.nameRegex)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })

  }

  onRegister() {
    const formData = this.registerForm.value;
      console.log("Form Submitted!", this.registerForm.value);
      this._userService.userRegister(formData).subscribe({
        next: (res) => {
          this._toastrService.success('Registration Successful!', 'Success', GlobalProperties.toastrconfig);
          this._router.navigate(['/login']);
        },
          error: (err) => {
            this._toastrService.error(err.error.message, 'Registration Failed', GlobalProperties.toastrconfig);
            this.registerForm.reset();
        }
      });
  }

  
}
