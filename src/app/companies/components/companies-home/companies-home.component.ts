import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyHomeService } from '../../services/companyHome.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddCompany, ICompany, } from '../../Dtos/CompanyHomeDto';
import { IDropdownList } from '../../Dtos/SharedDto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-companies-home',
  templateUrl: './companies-home.component.html',
  styleUrls: ['./companies-home.component.css']
})
export class CompaniesHomeComponent implements OnInit {
  companies: ICompany[] = []
  Activities: IDropdownList[] = []
  SubActivities: IDropdownList[] = []
  Sectors: IDropdownList[] = []
  Wilayat: IDropdownList[] = []
  Governorates: IDropdownList[] = []
  password: string = '';
  username: string = '';
  CompanyCode: string = '';
  Wilaya: string = '';
  Govenorates: string = '';
  sectorId: number = 0;
  companyForm!: FormGroup;
  showLoader: boolean = false;
  companyEmails: FormArray | null = null;
  company!: IAddCompany;
  add: boolean = true;
  id: number = 0;
  searchText : string ='';
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private companyHomeServices: CompanyHomeService
    , private sharedService: SharedService) { }
  ngOnInit(): void {
    this.companyForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      municipalityNumber: [''],
      compRegNumber: [''],
      accountingPeriod: [''],
      completionAccPeriod: [''],
      phoneNumber: [''],
      telNumber: [''],
      fax: [''],
      webSite: [''],
      address: [''],
      mailBox: [''],
      postalCode: [''],
      dateOfWork: [''],
      legalType: [''],
      institutionVlaue: [''],
      institutionHeadquarters: [''],
      sectorId: [0],
      activityId: [0],
      subActivityId: [0],
      governoratesId: [0],
      wilayatId: [0],
      // compEmails: this.formBuilder.array([
      //   this.formBuilder.group({
      //     Email: ['', [Validators.required, Validators.email]]
      //   })
      // ])
    });
    this.GetCompanies();
  }
  get compEmails(): FormArray {
    return this.companyForm.get('compEmails') as FormArray;
  }
  addEmail(): void {
    this.compEmails.push(this.formBuilder.control('', [Validators.required, Validators.email]));
  }
  removeEmail(): void {
    this.compEmails.removeAt(this.compEmails.length - 1)
  }
  GetSectorActvities(sectorId: number) {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.Activities = res.Data;
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
    this.companyHomeServices.GetSectorActvities(sectorId).subscribe(observer);
  }
  GetSubActivities(activityId: number) {
    const observer = {
      next: (res: any) => {

        if (res.Data) {
          this.SubActivities = res.Data;
          console.log(this.SubActivities)
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
    this.companyHomeServices.GetSubActivities(activityId).subscribe(observer);
  }
  GetCompanies(textSearch : string='') {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
        if (res.Data) {
          this.showLoader = false;
          this.companies = res.Data;
        }else{
          this.companies = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        debugger
        this.showLoader = false;
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
    this.companyHomeServices.GetCompanies(textSearch).subscribe(observer);
  }
  GetSectors() {
    const observer = {
      next: (res: any) => {


        if (res.Data) {
          this.Sectors = res.Data;
          console.log(this.Sectors)
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
    this.companyHomeServices.GetSectors().subscribe(observer);
  }
  GetWilayat() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.Wilayat = res.Data;
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
    this.companyHomeServices.GetWilayat().subscribe(observer);
  }
  GetGovernorates(wilayaId: number) {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.Governorates = res.Data;
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
    this.companyHomeServices.GetGovernorates(wilayaId).subscribe(observer);
  }
  GetCompanyCode() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.username = `FISC0${res.Data}`;
          this.CompanyCode = res.Data;
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
    this.companyHomeServices.GetCompanyCode().subscribe(observer);
  }
  generateRandomCredentials(): void {
    this.password = this.sharedService.generateRandomString(12); // Generate a 12 character password
  }
  saveCompany(): void {
    if (this.companyForm.valid) {
      const Model: IAddCompany = {
        userName: this.companyForm.value.userName,
        password: this.companyForm.value.password,
        arName: this.companyForm.value.arName,
        enName: this.companyForm.value.enName,
        municipalityNumber: this.companyForm.value.municipalityNumber,
        compRegNumber: this.companyForm.value.compRegNumber,
        accountingPeriod: this.companyForm.value.accountingPeriod,
        completionAccPeriod: this.companyForm.value.completionAccPeriod,
        phoneNumber: this.companyForm.value.phoneNumber,
        telNumber: this.companyForm.value.telNumber,
        fax: this.companyForm.value.fax,
        webSite: this.companyForm.value.webSite,
        address: this.companyForm.value.address,
        mailBox: this.companyForm.value.mailBox,
        postalCode: this.companyForm.value.postalCode,
        dateOfWork: this.companyForm.value.dateOfWork,
        institutionHeadquarters: this.companyForm.value.institutionHeadquarters,
        institutionVlaue: this.companyForm.value.institutionVlaue,
        legalType: this.companyForm.value.legalType,
        sectorId: this.companyForm.value.sectorId,
        activityId: this.companyForm.value.activityId,
        subActivityId: this.companyForm.value.subActivityId,
        governoratesId: this.companyForm.get('governoratesId')?.value,
        wilayatId: this.companyForm.value.wilayatId,
        companyEmails: this.companyForm.value.companyEmails
      }
      this.showLoader = true;
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.GetCompanies();
          this.resetForm();
          this.showLoader = false;
        },
        error: (err: any) => {
          this.showLoader = false;
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
      this.companyHomeServices.addCompany(Model).subscribe(observer);
    }
    else {
      this.toastr.error("يجب ادخال البيانات بشكل صحيح");
    }
  }
  resetForm() {
    this.companyForm.reset({
      userName: '',
      password: '',
      arName: '',
      enName: '',
      municipalityNumber: '',
      compRegNumber: '',
      accountingPeriod: [''],
      completionAccPeriod: '',
      phoneNumber: '',
      telNumber: '',
      fax: '',
      address: '',
      mailBox: '',
      postalCode: '',
      dateOfWork: '',
      legalType: '',
      sectorId: '',
      activityId: '',
      subActivityId: '',
      governoratesId: '',
      wilayatId: '',
      email_2: '',
      email_1: '',
      compValue: '',
      compBuild: '',
      webSite: '',
    });
    this.generateRandomCredentials();
    this.GetCompanyCode();
  }
  popAddCompany() {
    this.GetSectors();
    this.GetWilayat();
    this.generateRandomCredentials();
    this.GetCompanyCode();
    this.companyForm.get('sectorId')!.valueChanges.subscribe(value => {
      if (value != 0) {
        this.clearActivity();
        this.clearSubActivity();
      }
      this.GetSectorActvities(value);
    });
    this.companyForm.get('activityId')!.valueChanges.subscribe(value => {
      if (value != 0) {
        this.clearSubActivity();
      }
      this.GetSubActivities(value);
    });
    this.companyForm.get('wilayatId')!.valueChanges.subscribe(value => {
      if (value != 0) {
        this.clearGov();
      }
      this.GetGovernorates(value);
    });
  }
  DeleteCompany(id: number): void {
    debugger
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetCompanies();
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
    this.companyHomeServices.DeleteCompany(id).subscribe(observer);
  }
  showAlert(id: number): void {
    debugger
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
        debugger
        this.DeleteCompany(id);
      }
    });
  }
  validateInput(event: KeyboardEvent) {
    this.sharedService.validateInput(event);
  }
  onWilayaChange(): void {
    const selectedWilayaId = this.companyForm.get('wilayatId')?.value;
    const selectedWilaya = this.Wilayat.find(w => w.id = selectedWilayaId);
    if (selectedWilaya)
      this.Wilaya = selectedWilaya.arName
  }
  onGovenoratesChange(): void {
    const selectedGovenoratesId = this.companyForm.get('governoratesId')?.value;
    const selectedGovenorates = this.Governorates.find(w => w.id = selectedGovenoratesId);
    if (selectedGovenorates)
      this.Govenorates = selectedGovenorates.arName
  }
  editCompany(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
          this.company = res.Data;
          
          this.GetSectorActivities_UpdatePop(this.company.sectorId , this.company.activityId);
          this.GetGovernorates(this.company.wilayatId)
          this.onWilayaChange();
          this.onGovenoratesChange();
          this.showLoader = false;
          this.add = false;
          const button = document.getElementById('addCompanyBtn');
          if (button) {
            button.click();
            this.companyForm.patchValue({
              arName: this.company.arName,
              enName: this.company.enName,
              userName: this.company.userName,
              password: this.company.password,
              municipalityNumber: this.company.municipalityNumber,
              compRegNumber: this.company.compRegNumber,
              accountingPeriod: this.company.accountingPeriod,
              completionAccPeriod: this.company.completionAccPeriod,
              phoneNumber: this.company.phoneNumber,
              telNumber: this.company.telNumber,
              fax: this.company.fax,
              webSite: this.company.webSite,
              address: this.company.address,
              mailBox: this.company.mailBox,
              postalCode: this.company.postalCode,
              institutionHeadquarters: this.company.institutionHeadquarters,
              institutionVlaue: this.company.institutionVlaue,
              dateOfWork: this.company.dateOfWork,
              legalType: this.company.legalType,
              sectorId: this.company.sectorId,
              subActivityId: this.company.subActivityId,
              governoratesId: this.company.governoratesId,
              wilayatId: this.company.wilayatId,
            });
          }
          this.id = id;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.companyHomeServices.GetCompanyById(id).subscribe(observer);
  }
  updateCompany() {
    this.showLoader = true;
    if (this.companyForm.valid) {
      const Model: IAddCompany = {
        userName: this.companyForm.value.userName,
        password: this.companyForm.value.password,
        arName: this.companyForm.value.arName,
        enName: this.companyForm.value.enName,
        municipalityNumber: this.companyForm.value.municipalityNumber,
        compRegNumber: this.companyForm.value.compRegNumber,
        accountingPeriod: this.companyForm.value.accountingPeriod,
        completionAccPeriod: this.companyForm.value.completionAccPeriod,
        phoneNumber: this.companyForm.value.phoneNumber,
        telNumber: this.companyForm.value.telNumber,
        fax: this.companyForm.value.fax,
        webSite: this.companyForm.value.webSite,
        address: this.companyForm.value.address,
        mailBox: this.companyForm.value.mailBox,
        postalCode: this.companyForm.value.postalCode,
        dateOfWork: this.companyForm.value.dateOfWork,
        institutionHeadquarters: this.companyForm.value.institutionHeadquarters,
        institutionVlaue: this.companyForm.value.institutionVlaue,
        legalType: this.companyForm.value.legalType,
        sectorId: this.companyForm.value.sectorId,
        activityId: this.companyForm.value.activityId,
        subActivityId: this.companyForm.value.subActivityId,
        governoratesId: this.companyForm.get('governoratesId')?.value,
        wilayatId: this.companyForm.value.wilayatId,
        companyEmails: this.companyForm.value.companyEmails
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetCompanies();
          this.showLoader = false;
          this.add = true;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });

        },
        error: (err: any) => {
          debugger
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.companyHomeServices.UpdateCompany(this.id, Model).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }
  clearActivity() {
    this.companyForm.get('activityId')?.setValue('');
  }
  clearSubActivity() {
    this.companyForm.get('subActivityId')?.setValue('');
  }
  clearGov() {
    this.companyForm.get('governoratesId')?.setValue('');
  }
  companiesSearch(){
    this.GetCompanies(this.searchText);
  }

  GetSectorActivities_UpdatePop(sectorId : number , activityId : number){
    debugger
    this.GetSectorActvities(sectorId)
    this.GetSubActivities_UpdatePop(activityId)
  }
  GetSubActivities_UpdatePop(activityId : number){
    this.GetSubActivities(this.company.activityId)
  }
}