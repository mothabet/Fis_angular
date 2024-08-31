import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { ICoverFormDetailsDto, IGetFormDto, IQuarterCoverFormDataDto } from 'src/app/Forms/Dtos/FormDto';
import { IGetQuestionDto } from 'src/app/Forms/Dtos/QuestionDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-shared-quarter-form-cover',
  templateUrl: './shared-quarter-form-cover.component.html',
  styleUrls: ['./shared-quarter-form-cover.component.css']
})
export class SharedQuarterFormCoverComponent implements OnInit {
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
  coverFormData!: IQuarterCoverFormDataDto;
  constructor(private authService: LoginService, private formServices: FormService, private router: Router, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.isCoverActive = true
    this.GetFormById(+this.formId);
  }

  GetFormById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
          this.coverForm = res.Data
          this.GetFormData();
        }
      },
      error: (err: any) => {
        this.Loader = false;
        this.sharedServices.handleError(err);
      },
    };
    this.formServices.GetFormById(id).subscribe(observer);
  }
  GetFormData() {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        debugger
        const isLoggedIn = this.authService.getToken();
        if (isLoggedIn != "") {
          let res_ = this.authService.decodedToken(isLoggedIn);
          var role = res_.roles;
          if (res.Data) {
            if (res.Data.length > 0) {
              this.coverFormData = JSON.parse(res.Data[0].coverData) as IQuarterCoverFormDataDto;
              const quarterCoverFormData: IQuarterCoverFormDataDto = {
                establishmentName: "0",
                postalAddress: "0",
                telephoneNumber: "0",
                faxNumber: "0",
                emailAddress: "0",
                geographicalDistribution: "0"
              };
              let storedTables = localStorage.getItem(`quarterCoverForm`);
              if (storedTables)
                this.coverForm.quarterCoverData = JSON.parse(storedTables) as IQuarterCoverFormDataDto;
              else if (this.coverFormData)
                this.coverForm.quarterCoverData = this.coverFormData
              else
                this.coverForm.quarterCoverData = quarterCoverFormData;
              
            }
            
          }
          this.Loader = false;

        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormData(+this.formId, +this.companyId, 0).subscribe(observer);
  }
  ngOnDestroy(){
    debugger
    let quarterCoverForm = localStorage.getItem(`quarterCoverForm`);
      if (quarterCoverForm) {
        localStorage.removeItem(`quarterCoverForm`);
      }
      localStorage.setItem(`quarterCoverForm`, JSON.stringify(this.coverForm.quarterCoverData));

  }
}
