import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { ICertificationDto, ICoverFormDetailsDto } from 'src/app/Forms/Dtos/FormDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-shared-certification',
  templateUrl: './shared-certification.component.html',
  styleUrls: ['./shared-certification.component.css']
})
export class SharedCertificationComponent {
  coverForm!: ICoverFormDetailsDto;
  Loader: boolean = false;
  @Input() formId!: string;
  companyId!: string;
  isCertificationActive: boolean = false;
  constructor(private authService: LoginService, private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.GetFormById(+this.formId);
    this.isCertificationActive = true;
  }
  GetFormById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          const certificationData: ICertificationDto = {
            companiesDetails: '',
            completedBy: '',
            telephoneNo: '',
            dateOfCompletion: '',
          };
          this.coverForm = res.Data;
          this.coverForm.certification = certificationData
          this.GetFormData();
        }
        this.Loader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id).subscribe(observer);
  }

  GetFormData() {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        const isLoggedIn = this.authService.getToken();
        if (isLoggedIn != "") {
          let res_ = this.authService.decodedToken(isLoggedIn);
          var role = res_.roles;
          if (res.Data) {
            const certificationData: ICertificationDto = {
              companiesDetails: '',
              completedBy: '',
              telephoneNo: '',
              dateOfCompletion: '',
            };
            let certification = localStorage.getItem(`certification`);
            if (certification)
              this.coverForm.certification = JSON.parse(certification) as ICertificationDto;
            else if (res.Data[0].certificationData)
              this.coverForm.certification = JSON.parse(res.Data[0].certificationData) as ICertificationDto
            else
              this.coverForm.certification = certificationData;
            
            this.Loader = false;
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

  ngOnDestroy() {
    debugger
    let certification = localStorage.getItem(`certification`);
    if (certification) {
      localStorage.removeItem(`certification`);
    }
    localStorage.setItem(`certification`, JSON.stringify(this.coverForm.certification));
  }
}
