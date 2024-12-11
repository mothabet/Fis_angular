import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { TopScreenService } from '../../services/top-screen.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import Swal from 'sweetalert2';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { ResearcherHomeService } from 'src/app/researcher/services/researcher-home.service';
import { environment } from 'src/environments/environment.development';
import { ProfileService } from 'src/app/profile/Services/profile.service';

@Component({
  selector: 'app-top-screen',
  templateUrl: './top-screen.component.html',
  styleUrls: ['./top-screen.component.css']
})
export class TopScreenComponent implements OnInit {
  passwordForm!: FormGroup;
  @Input() title = '';
  researcherId = '';
  role: string = "";
  arName: string = "";
  Loader = false;
  selectedImageUrl!: string
  constructor(private topScreenServices: TopScreenService, private loginService: LoginService, private router: Router,
    private sharedService: SharedService, private profileService: ProfileService, private formBuilder: FormBuilder
    , private companyServices: CompanyHomeService, private researcherServices: ResearcherHomeService
  ) { }
  ngOnInit(): void {
    
    this.Loader = true
    const isLoggedIn = this.loginService.getToken();
    let result = this.loginService.decodedToken(isLoggedIn);
    this.role = result.roles;
    this.researcherId = this.topScreenServices.getResearcherId();
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
    if (this.role == 'Company') {
      this.GetCompanyByUserId();
    }
    else if (this.role == 'Researchers') {
      this.Loader = true;
      this.GetProfileResearcherByUserId();
    }
    else if(this.role == 'Admin'){
      this.Loader = true;
      this.GetProfileByUserId();
    }
    this.topScreenServices.currentImageUrl.subscribe((url: string) => {
      this.selectedImageUrl = url; // Update the image URL
    });
    this.topScreenServices.currentArName.subscribe((arName: string) => {
      this.arName = arName; // Update the image URL
    });
    this.arName = result.arName;

  }
  LogOut() {

    this.loginService.deleteToken();
    this.router.navigate(['/Login']);
  }
  generateRandomCredentials(): void {
    this.Loader = true;
    this.passwordForm.patchValue({
      password: this.sharedService.generateRandomString(12), // Generate a 12 character password
      confirmPassword: this.passwordForm.value.password
    });
    this.Loader = false;
  }
  updatePassword(): void {
    this.Loader = true;
    if (this.passwordForm.valid) {
      const formData = new FormData();
      formData.append('passWord', this.passwordForm.value.password);

      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel1');
          if (button) {
            button.click();
          }
          const isLoggedIn = this.loginService.getToken();
          let result = this.loginService.decodedToken(isLoggedIn);
          this.role = result.roles;
          this.arName = this.arName;
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
      this.topScreenServices.updatePassword(formData).subscribe(observer);
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
  GetCompanyByUserId() {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.selectedImageUrl = `${environment.dirUrl}imageProfile/${res.Data}`;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.Loader = false;
      },
    };
    this.companyServices.GetProfileCompanyByUserId().subscribe(observer);
  }
  GetProfileResearcherByUserId() {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.selectedImageUrl = `${environment.dirUrl}imageProfile/${res.Data}`;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.Loader = false;
      },
    };
    this.researcherServices.GetProfileResearcherByUserId().subscribe(observer);
  }
  GetProfileByUserId() {
    
    const observer = {
      next: (res: any) => {
        
        if (res.Data) {
          this.selectedImageUrl = `${environment.dirUrl}imageProfile/${res.Data.imageDto}`;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.Loader = false;
      },
    };
    this.profileService.GetProfileByUserId().subscribe(observer);
  }
}
