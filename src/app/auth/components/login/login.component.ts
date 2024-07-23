import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ILogin } from '../../Dtos/AuthDto';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { SidebarService } from 'src/app/shared/services/sidebar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  logInForm!: FormGroup;
  
  constructor(private formBuilder: FormBuilder,private toastr: ToastrService, private loginService:LoginService, 
    private router: Router, private sidebarService: SidebarService) {
    
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
  Login(){
    if (this.logInForm.valid) {
      const Model: ILogin = {
        UserName: this.logInForm.value.UserName,
        password: this.logInForm.value.password
      }
      const observer = {
        next: (res: any) => {
          if (res.Data) {
            this.loginService.saveToken(res.Data.Token);
            this.router.navigate(['/Home']);
          }
        },
        error: (err: any) => {
          if (err.status) {
            switch (err.status) {
              case 400:
                this.toastr.error(err.error.Errors[0]);
                break;
              case 401:
                this.toastr.error('Unauthorized', err.message);
                break;
              case 403:
                this.toastr.error('Forbidden', err.message);
                break;
              case 404:
                this.toastr.error('Not Found', err.message);
                break;
              case 500:
                this.toastr.error('Internal Server Error', err.message);
                break;
              default:
                this.toastr.error('An unexpected error occurred', err.message);
            }
          } else {
            this.toastr.error('An unknown error occurred', err.message);
          }
        },
      };
      this.loginService.LogIn(Model).subscribe(observer);
    }
    else {
      this.toastr.error("يجب ادخال البيانات بشكل صحيح");
    }
  }
}