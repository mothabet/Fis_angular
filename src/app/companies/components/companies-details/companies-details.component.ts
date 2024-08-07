import { Component, OnInit } from '@angular/core';
import { ICompany } from '../../Dtos/CompanyHomeDto';
import { ActivatedRoute } from '@angular/router';
import { CompanyHomeService } from '../../services/companyHome.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-companies-details',
  templateUrl: './companies-details.component.html',
  styleUrls: ['./companies-details.component.css']
})
export class CompaniesDetailsComponent implements OnInit{
  showLoader: boolean = false;
  company!: ICompany;
  companyId!: string;
  constructor(private activeRouter: ActivatedRoute, private companyServices: CompanyHomeService, private sharedServices: SharedService) {

  }
  ngOnInit(): void {
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.GetCompanyById(+this.companyId);
  }
  GetCompanyById(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        debugger
        if (res.Data) {
          this.company = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.companyServices.GetCompanyById(id).subscribe(observer);
  }

}
