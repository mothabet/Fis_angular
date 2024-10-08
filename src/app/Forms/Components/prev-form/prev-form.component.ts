import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { ICoverFormDetailsDto } from 'src/app/Forms/Dtos/FormDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-prev-form',
  templateUrl: './prev-form.component.html',
  styleUrls: ['./prev-form.component.css']
})
export class PrevFormComponent {
  role:string = "";
  Loader = false;
  companyId!:number;
  formId!:string;
  coverForm!: any[];
  
  constructor(private router: Router,private formServices:FormService, private authService: LoginService , private sharedServices:SharedService,private companyServices : CompanyHomeService) {
        
  }
  ngOnInit(): void {
    this.GetCompany()
  }
  GetCompany(){
    this.Loader = true
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
    debugger
    const observer = {
      next: (res: any) => {
        this.companyId = res.Data;
        this.GetCompanyForms();
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.companyServices.GetCompanyByUserId(result.id).subscribe(observer);
  }
  GetCompanyForms(){
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        this.coverForm = res.Data
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetCompanyForms(this.companyId,2).subscribe(observer);
  }
  formNavigate(id: number) {
    debugger
    this.GetFormById(id)
  }

  GetFormById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        debugger
        this.formId = res.Data.id
        if (res.Data.Type == 1)
          this.router.navigate(['/FormDetails', this.formId , 'null',this.companyId]);
        else if (res.Data.Type == 2)
          this.router.navigate(['/QuarterFormCover', this.formId, 'null',this.companyId]);
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id).subscribe(observer);
  }
}
