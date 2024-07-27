import { Component, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CompanyHomeService } from '../../services/companyHome.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddCompany, ICompaniesPDF, ICompany, } from '../../Dtos/CompanyHomeDto';
import { IDropdownList } from '../../Dtos/SharedDto';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { arabicFont } from 'src/app/shared/services/arabic-font';

@Component({
  selector: 'app-companies-home',
  templateUrl: './companies-home.component.html',
  styleUrls: ['./companies-home.component.css']
})
export class CompaniesHomeComponent implements OnInit {
  private arabicCharMap: { [key: string]: string } = {
    'ء': 'ﺀ', 'آ': 'ﺁ', 'أ': 'ﺃ', 'ؤ': 'ﺅ', 'إ': 'ﺇ', 'ئ': 'ﺉ', 'ا': 'ﺍ', 'ب': 'ﺏ', 'ة': 'ﺓ', 'ت': 'ﺕ',
    'ث': 'ﺙ', 'ج': 'ﺝ', 'ح': 'ﺡ', 'خ': 'ﺥ', 'د': 'ﺩ', 'ذ': 'ﺫ', 'ر': 'ﺭ', 'ز': 'ﺯ', 'س': 'ﺱ', 'ش': 'ﺵ',
    'ص': 'ﺹ', 'ض': 'ﺽ', 'ط': 'ﻁ', 'ظ': 'ﻅ', 'ع': 'ﻉ', 'غ': 'ﻍ', 'ف': 'ﻑ', 'ق': 'ﻕ', 'ك': 'ﻙ', 'ل': 'ﻝ',
    'م': 'ﻡ', 'ن': 'ﻥ', 'ه': 'ﻩ', 'و': 'ﻭ', 'ي': 'ﻱ'
  };
  companies: ICompany[] = []
  companiesPDF: ICompaniesPDF[] = []
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
  searchText: string = '';
  phoneCode: number = 968;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  tableColumns = ['عنوان الشركة', 'النشاط', 'رمز النشاط', 'رقم الشركة', 'رقم السجل التجاري', 'اسم الشركة'];
  constructor(private formBuilder: FormBuilder, private toastr: ToastrService, private companyHomeServices: CompanyHomeService
    , private sharedService: SharedService) { }
  ngOnInit(): void {
    this.companyForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      arName: [''],
      enName: [''],
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
    this.GetCompanies('', 1);
  }
  get compEmails(): FormArray {
    return this.companyForm.get('compEmails') as FormArray;
  }
  onPageChange(page: number) {
    debugger
    this.currentPage = page;
    this.GetCompanies('', page);
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
  GetCompanies(textSearch: string = '', page: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
        this.showLoader = false;
        if (res.Data) {
          this.companies = res.Data.getCompaniesDtos;
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.resetForm();
        }
        else {
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
    this.companyHomeServices.GetCompanies(textSearch, page).subscribe(observer);
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
  GetWilayat(govId: number) {
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
    this.companyHomeServices.GetWilayat(govId).subscribe(observer);
  }
  GetGovernorates() {
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
    this.companyHomeServices.GetGovernorates().subscribe(observer);
  }
  GetCompanyCode() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
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
    debugger
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
      debugger
      this.showLoader = true;
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.GetCompanies('', 1);
          this.resetForm();
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
    this.GetGovernorates();
    this.generateRandomCredentials();
    if (this.add)
    {
      this.GetCompanyCode();
      this.resetForm();
    }
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
    this.companyForm.get('governoratesId')!.valueChanges.subscribe(value => {
      if (value != 0) {
        this.clearWilayat();
      }
      this.GetWilayat(value);
    });
  }
  DeleteCompany(id: number): void {
    debugger
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetCompanies('', 1);
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
          this.company = res.Data;
          this.GetSectorActivities_UpdatePop(this.company.sectorId, this.company.activityId);
          this.GetWilayat(this.company.governoratesId)
          this.onWilayaChange();
          this.onGovenoratesChange();
          this.showLoader = false;
          this.add = false;
          const button = document.getElementById('addCompanyBtn');
          if (button) {
            button.click();
            debugger
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
              activityId: this.company.activityId,
              subActivityId: this.company.subActivityId,
              governoratesId: this.company.governoratesId,
              wilayatId: this.company.wilayatId,
            });
          }
          debugger
          this.id = id;
          this.CompanyCode = id.toString();
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
          this.GetCompanies('', 1);
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
    this.companyForm.get('activityId')?.setValue(0);
  }
  clearSubActivity() {
    this.companyForm.get('subActivityId')?.setValue(0);
  }
  clearWilayat() {
    this.companyForm.get('wilayatId')?.setValue(0);
  }
  companiesSearch() {
    this.GetCompanies(this.searchText, 1);
  }
  GetSectorActivities_UpdatePop(sectorId: number, activityId: number) {
    debugger
    if (this.Sectors)
      this.GetSectorActvities(sectorId)
    if (this.Activities)
      this.GetSubActivities_UpdatePop(activityId)
  }
  GetSubActivities_UpdatePop(activityId: number) {
    this.GetSubActivities(this.company.activityId)
  }
  generatePdf(data: any[], columns: string[]) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    // Add the Arabic font to jsPDF
    doc.addFileToVFS('Arabic-Regular.ttf', arabicFont);
    doc.addFont('Arabic-Regular.ttf', 'Arabic', 'normal');
    doc.setFont('Arabic');

    // Add a title
    doc.text('الشركات', 10, 10);

    // Generate the table
    autoTable(doc, {
      head: [columns],
      body: data.map(item => [
        item.address,
        item.arActivityName,
        item.activityId,
        item.id,
        item.compRegNumber,
        item.arName
      ]),
      styles: {
        font: 'Arabic',
        halign: 'right' // Horizontal alignment
      },
      bodyStyles: {
        halign: 'right'
      },
      headStyles: {
        halign: 'right'
      }
    });

    // Save the PDF
    doc.save('companies.pdf');
  }
  fixArabic(text: string): string {
    return text.split('').map(char => this.arabicCharMap[char] || char).join('');
  }
  printPdf() {
    this.companiesPDF = this.transformToPDF(this.companies);
    this.generatePdf(this.companiesPDF, this.tableColumns);
  }
  transformToPDF(companies: ICompany[]): ICompaniesPDF[] {
    return companies.map(company => ({
      activityId: company.activityId,
      arActivityName: company.arActivityName,
      address: company.address,
      arName: company.arName,
      compRegNumber: company.compRegNumber,
      id: company.id
    }));
  }
  closePopup()
  {
    this.add = true;
    this.resetForm();
  }
}