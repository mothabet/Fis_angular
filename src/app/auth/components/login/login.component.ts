import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILogin } from '../../Dtos/AuthDto';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  logInForm!: FormGroup;
  showLoader: boolean = false;
  showPassword: boolean = false; // متغير لتعقب حالة إظهار/إخفاء كلمة المرور
  constructor(private formBuilder: FormBuilder, private loginService: LoginService,
    private router: Router, private sidebarService: SidebarService, private sharedService: SharedService) {

  }
  ngOnInit() {
    this.sidebarService.hide();
    this.logInForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.sidebarService.show();

  }
  Login() {
    this.showLoader = true;
    if (this.logInForm.valid) {
      const Model: ILogin = {
        UserName: this.logInForm.value.UserName,
        password: this.logInForm.value.password
      }
      const observer = {
        next: (res: any) => {
          if (res.Data) {
            
            this.loginService.saveToken(res.Data.Token);
            this.showLoader = false;
            this.router.navigate(['/Home']);
          }
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.loginService.LogIn(Model).subscribe(observer);
    }
    else {
      Swal.fire({
        icon: 'error',
        title: "يجب ادخال البيانات بشكل صحيح",
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword; // تبديل حالة إظهار/إخفاء كلمة المرور
  }
}