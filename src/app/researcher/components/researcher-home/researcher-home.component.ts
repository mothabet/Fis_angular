import { Component, ElementRef, ViewChild } from '@angular/core';
import { ResearcherHomeService } from '../../services/researcher-home.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddResearcher, IResearcher } from '../../Dtos/ResearcherHomeDto';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-researcher-home',
  templateUrl: './researcher-home.component.html',
  styleUrls: ['./researcher-home.component.css']
})
export class ResearcherHomeComponent {
  @ViewChild('addResearcher') addResearcherModal!: ElementRef;
  researcherForm!: FormGroup;
  isDisabled: boolean = true;
  username: string = '';
  password: string = '';
  researcherCode: number = 0;
  researcher : IResearcher[] = []
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private researcherService: ResearcherHomeService
    , private sharedService: SharedService) { }

  ngOnInit(): void {
    this.researcherForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      fullName: ['', Validators.required],
      enfullName: ['', Validators.required],
      status: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.generateRandomCredentials();
    this.GetAllReseachers();
  }
  generateRandomCredentials(): void {
    this.GetResearcherCode();
    this.password = this.sharedService.generateRandomString(12); // Generate a 12 character password
  }
  saveResearcher(): void {
    if (this.researcherForm.valid) {
      const Model: IAddResearcher = {
        userName: this.researcherForm.value.userName,
        password: this.researcherForm.value.password,
        fullName: this.researcherForm.value.fullName,
        enfullName: this.researcherForm.value.enfullName,
        status: this.researcherForm.value.status,
        phone: this.researcherForm.value.phone,
        email: this.researcherForm.value.email,
      }
      const observer = {
        next: (res: any) => {
          this.resetForm();
          this.GetAllReseachers();
        },
        error: (err: any) => {
          debugger
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
      this.researcherService.addResearcher(Model).subscribe(observer);
    }
    else {
      this.toastr.error("يجب ادخال البيانات بشكل صحيح");
    }
  }
  GetResearcherCode() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.username = `FIS_R${res.Data}`;
        }
      },
      error: (err: any) => {
        debugger
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
    this.researcherService.GetResearcherCode().subscribe(observer);
  }
  resetForm() {
    this.researcherForm.reset({
      userName: '',
      password: '',
      fullName: '',
      enfullName: '',
      status: '', // Default value for status after reset
      phone: '',
      email: ''
    });
    this.generateRandomCredentials();
  }
  
  GetAllReseachers(){
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.researcher = res.Data;
          console.log(this.researcher);
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
    this.researcherService.GetAllReseachers().subscribe(observer);
  }
}
