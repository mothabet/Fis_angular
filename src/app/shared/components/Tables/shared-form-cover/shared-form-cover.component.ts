import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { ICoverFormDetailsDto, IGetFormDto } from 'src/app/Forms/Dtos/FormDto';
import { IGetQuestionDto } from 'src/app/Forms/Dtos/QuestionDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ICoverFormData } from 'src/app/shared/Dtos/FormDataDto';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-shared-form-cover',
  templateUrl: './shared-form-cover.component.html',
  styleUrls: ['./shared-form-cover.component.css']
})
export class SharedFormCoverComponent implements OnInit {
  Loader: boolean = false;
  noData: boolean = false;
  forms: IGetFormDto[] = [];
  coverForm!: ICoverFormDetailsDto;
  noTables = true;
  @Input() formId!: string;
  @Input() companyId!: string;
  table!: IGetTableDto;
  years!: number[];
  currentYear: number = 0;
  period: number = 0;
  formContent!: IGetQuestionDto[]
  isCoverActive = false;
  sharedTableType!: number;
  coverFormData!: ICoverFormData
  constructor(private authService: LoginService, private formServices: FormService, private router: Router, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.isCoverActive = true
    this.GetFormById(+this.formId)
  }
  GetFormById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          this.coverForm = res.Data;
          this.GetFormData();
        }
      },
      error: (err: any) => {

        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id, '', +this.companyId).subscribe(observer);
  }
  GetFormData() {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        const isLoggedIn = this.authService.getToken();
        if (isLoggedIn != "") {
          let res_ = this.authService.decodedToken(isLoggedIn);
          var role = res_.roles;
          
          const coverFormData: ICoverFormData = {
            officialUse: '',
            activityCode: ''
          };
          this.coverForm.coverFormData = coverFormData as ICoverFormData
          let coverData = localStorage.getItem(`coverFormData`);
          if (coverData)
            this.coverForm.coverFormData = JSON.parse(coverData) as ICoverFormData;
          else if (res.Data[0].coverData)
            this.coverForm.coverFormData = JSON.parse(res.Data[0].coverData) as ICoverFormData
          else
            this.coverForm.coverFormData = coverFormData;
          if (res.Data.tables.length > 0)
            this.noTables = false;
          this.Loader = false;
        }
        this.Loader = false;
      },
      error: (err: any) => {
        
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormData(+this.formId, +this.companyId, 0).subscribe(observer);
  }


  ngOnDestroy() {
    
    let coverFormData = localStorage.getItem(`coverFormData`);
    if (coverFormData) {
      localStorage.removeItem(`coverFormData`);
    }
    localStorage.setItem(`coverFormData`, JSON.stringify(this.coverForm.coverFormData));
  }
}
