import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { FormService } from 'src/app/Forms/Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-company-home',
  templateUrl: './company-home.component.html',
  styleUrls: ['./company-home.component.css']
})
export class CompanyHomeComponent implements OnInit{
  role:string = "";
  Loader = false;
  companyId!:number;
  formId!:string;
  constructor(private formServices:FormService, private authService: LoginService , private sharedServices:SharedService,private companyServices : CompanyHomeService) {

  }
  ngOnInit(): void {
    this.Loader = true;
    this.GetCompany();
  }
  GetCompany(){
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
    const observer = {
      next: (res: any) => {
        debugger
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
    debugger
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        this.formId = '205';
      },
      error: (err: any) => {
        debugger
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetCompanyForms(this.companyId,1).subscribe(observer);
  
  }
}
