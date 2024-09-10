import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { TopScreenService } from '../../services/top-screen.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-top-screen',
  templateUrl: './top-screen.component.html',
  styleUrls: ['./top-screen.component.css']
})
export class TopScreenComponent implements OnInit
{
  passwordForm!: FormGroup;
  @Input() title = '';
  researcherId = '';
  role: string = "";
  arName: string = "";
  Loader = false;
  constructor(private topScreenServices:TopScreenService,private loginService: LoginService, private router: Router,
     private sharedService: SharedService, private authService: LoginService, private formBuilder: FormBuilder,
    ) { }
  ngOnInit(): void {
    this.Loader = true
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
    this.arName = result.arName;
    this.researcherId = this.topScreenServices.getResearcherId();
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }
  LogOut() {
    debugger
    this.loginService.deleteToken();
    this.router.navigate(['/Login']);
  }
  generateRandomCredentials(): void {
    this.Loader = true;
    this.passwordForm.patchValue({
      password: this.sharedService.generateRandomString(12), // Generate a 12 character password
      confirmPassword : this.passwordForm.value.password
    });
    this.Loader = false;
  }
  updatePassword(): void {
    this.Loader = true;
    if (this.passwordForm.valid) {
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          const isLoggedIn = this.authService.getToken();
          let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
    this.arName = result.arName;
          this.Loader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          this.Loader = false;
        },
      };
      this.topScreenServices.updatePassword(this.passwordForm.value.password).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'success',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.Loader = false;
    }
  }

}
