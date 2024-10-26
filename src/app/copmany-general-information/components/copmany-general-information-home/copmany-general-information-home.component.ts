import { Component } from '@angular/core';
import { IAddCompanyGeneralInformations, ICompanyGeneralInformations } from '../../Dtos/CompanyGeneralInformationDto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CopmanyGeneralInformationService } from '../../services/copmany-general-information.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-copmany-general-information-home',
  templateUrl: './copmany-general-information-home.component.html',
  styleUrls: ['./copmany-general-information-home.component.css']
})
export class CopmanyGeneralInformationHomeComponent {
  showLoader: boolean = false;
  companyId!: string;
  companyGeneralInformations: ICompanyGeneralInformations[] = [];
  companyGeneralInformation!: ICompanyGeneralInformations;
  add: boolean = true;
  id: number = 0;
  copmanyGeneralInformationForm!: FormGroup;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  noData: boolean = false;
  phoneCode: number = 968;
  constructor(
    private formBuilder: FormBuilder,
    private companyGeneralInformationService: CopmanyGeneralInformationService,
    private sharedService: SharedService,
    private activeRouter: ActivatedRoute,
  ) { }
  ngOnInit(): void {
    this.copmanyGeneralInformationForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      phone: [
        '',
        [
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(8)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
    });
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.GetAllCopmanyGeneralInformations(this.currentPage);
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetAllCopmanyGeneralInformations(page);
  }
  onlyNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }
  editCopmanyGeneralInformation(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.companyGeneralInformation = res.Data;
          this.copmanyGeneralInformationForm.patchValue({
            arName: this.companyGeneralInformation.arName,
            enName: this.companyGeneralInformation.enName,
            email: this.companyGeneralInformation.email,
            phone: this.companyGeneralInformation.phone,
          });
          this.add = false;
          const button = document.getElementById('addCompanyMessageBtn');
          if (button) {
            button.click();
          }
          this.id = id;
          this.showLoader = false;

        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.companyGeneralInformationService.GetCopmanyGeneralInformationId(id).subscribe(observer);
  }
  UpdateCopmanyGeneralInformation() {
    this.showLoader = true;
    if (this.copmanyGeneralInformationForm.valid) {
      const Model: IAddCompanyGeneralInformations = {
        companyid: Number(this.companyId),
        arName: this.copmanyGeneralInformationForm.value.arName,
        enName: this.copmanyGeneralInformationForm.value.enName,
        email: this.copmanyGeneralInformationForm.value.email,
        phone: this.copmanyGeneralInformationForm.value.phone,
      };
      const observer = {
        next: (res: any) => {
          
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllCopmanyGeneralInformations(1);
          this.showLoader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err: any) => {
          
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.companyGeneralInformationService.UpdateCompanyGeneralInformation(this.id, Model).subscribe(observer);
    } else {
      const allErrors: string[] = [];
      for (const controlName in this.copmanyGeneralInformationForm.controls) {
        if (this.copmanyGeneralInformationForm.controls[controlName].invalid) {
          const errors = this.getControlErrors(controlName);
          allErrors.push(...errors);
        }
      }
      Swal.fire({
        icon: 'error',
        title: allErrors.join('<br>'),
        showConfirmButton: false,
        timer: 2000,
      });
      this.showLoader = false;
    }
  }
  GetAllCopmanyGeneralInformations(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.companyGeneralInformations = res.Data.companyGeneralInformationDtos;
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.resetForm();
        }
        else {
          this.companyGeneralInformations = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.companyGeneralInformationService.GetAllCopmanyGeneralInformations(page, textSearch).subscribe(observer);
  }
  resetForm(): void {
    this.copmanyGeneralInformationForm.reset({
      arName: '',
      enName: '',
      phone: '',
      email: ''
    });
  }
  reset() {
    this.add = true;
    this.resetForm();
  }
  showAlert(id: number): void {
    Swal.fire({
      title: 'هل انت متأكد؟',
      text: 'لا يمكن التراجع عن هذا',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(46, 97, 158)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم اريد المسح!',
      cancelButtonText: 'لا'
    }).then((result) => {
      if (result.isConfirmed) {
        this.DeleteCopmanyGeneralInformation(id);
      }
    });
  }
  DeleteCopmanyGeneralInformation(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllCopmanyGeneralInformations(1);
        this.showLoader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 1500
        });
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.companyGeneralInformationService.DeleteCopmanyGeneralInformation(id).subscribe(observer);
  }
  getControlErrors(controlName: string): string[] {
    const control = this.copmanyGeneralInformationForm.get(controlName);
    const errors: string[] = [];
    if (control && control.errors) {
      if (controlName == 'arName') controlName = 'الاسم بالعربي';
      if (controlName == 'enName') controlName = 'الاسم بالانجليزي';
      if (controlName == 'phone') controlName = 'رقم الهاتف';
      if (controlName == 'email') controlName = 'البريد الالكتروني';
      if (control.errors['required']) {
        errors.push(`يجب ادخال ${controlName}`);
      }
    }
    return errors;
  }
  saveCopmanyGeneralInformation(): void {
    this.showLoader = true;
    if (this.copmanyGeneralInformationForm.valid) {
      const Model: IAddCompanyGeneralInformations = {
        companyid: Number(this.companyId),
        arName: this.copmanyGeneralInformationForm.value.arName,
        enName: this.copmanyGeneralInformationForm.value.enName,
        email: this.copmanyGeneralInformationForm.value.email,
        phone: this.copmanyGeneralInformationForm.value.phone,
      };
      const observer = {
        next: (res: any) => {
          
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllCopmanyGeneralInformations(1);
          this.showLoader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.companyGeneralInformationService.AddCompanyGeneralInformation(Model).subscribe(observer);
    } else {
      const allErrors: string[] = [];
      for (const controlName in this.copmanyGeneralInformationForm.controls) {
        if (this.copmanyGeneralInformationForm.controls[controlName].invalid) {
          const errors = this.getControlErrors(controlName);
          allErrors.push(...errors);
        }
      }
      Swal.fire({
        icon: 'error',
        title: allErrors.join('<br>'),
        showConfirmButton: false,
        timer: 2000,
      });
      this.showLoader = false;
    }
  }
}
