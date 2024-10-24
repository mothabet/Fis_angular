import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyHomeService } from '../../services/companyHome.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddCompany, IAddCompanyByExcel, ICompaniesPDF, ICompany, ICompanyEmail, } from '../../Dtos/CompanyHomeDto';
import { IDropdownList } from '../../Dtos/SharedDto';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { arabicFont } from 'src/app/shared/services/arabic-font';
import * as XLSX from 'xlsx';
import { SectorAndActivitiesService } from 'src/app/sectors-and-activities/Services/sector-and-activities.service';

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
  addCompanyByExcel: IAddCompanyByExcel[] = []
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
  sectorName: string = "";
  sectorCode: string = "";
  activityName: string = "";
  subActivityName:string ="";
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
  tableColumns = ['رقم الهاتف', 'عنوان الشركة', 'النشاط', 'رمز النشاط', 'رقم الشركة', 'رقم السجل التجاري', 'اسم الشركة'];
  data: any[] = [];
  years: number[] = [];
  constructor(private formBuilder: FormBuilder, private companyHomeServices: CompanyHomeService
    , private sharedService: SharedService, private sectorsAndActivitiesServices: SectorAndActivitiesService) { }
  ngOnInit(): void {
    this.companyForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      facilityType: [''],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      municipalityNumber: [''],
      compRegNumber: ['', Validators.required],
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
      sectorId: [{value:'',disabled:true}, Validators.required],
      sectorName: [{value:'',disabled:true}, Validators.required],
      sectorCode: [{value:'',disabled:true}, Validators.required],
      activityId: ['', Validators.required],
      activityName: [{value:'',disabled:true}, Validators.required],
      subActivityId: [0],
      subActivityName: [{value:'',disabled:true},],
      governoratesId: [0],
      wilayatId: [0],
      status: [true],
      compEmails: this.formBuilder.array([this.createEmailField()])
    });
    const currentYear = new Date().getFullYear();
    for (let year = 1990; year <= currentYear; year++) {
      this.years.push(year);
    }
    this.GetCompanies('', 1);
    this.username = this.companyForm.value.username;
    this.GetSectorActvities(0);
  }
  getActivityByActivityId(activityId: number) {
    const observer = {
      next: (res: any) => {
        
        if (res.Data) {
          debugger
          this.sectorId = res.Data.sectorId;
          this.sectorCode = res.Data.code;
          this.sectorName = res.Data.sectorName;
          this.activityName = res.Data.arName;
          this.companyForm.value.sectorId = this.sectorId;
          this.companyForm.value.sectorCode = this.sectorCode;
          this.companyForm.value.sectorName = this.sectorName;
          this.companyForm.value.activityName = this.activityName;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
      },
    };
    this.sectorsAndActivitiesServices.getActivityByActivityId(activityId).subscribe(observer);
  }
  getActivityBySubActivityId(activityId: number) {
    const observer = {
      next: (res: any) => {
        
        if (res.Data) {
          this.subActivityName = res.Data.arName;
          this.companyForm.value.subActivityName = this.activityName;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
      },
    };
    this.sectorsAndActivitiesServices.getActivityByActivityId(activityId).subscribe(observer);
  }
  @ViewChild('fileInput') fileInput!: ElementRef;

  triggerFileInput(): void {
    this.fileInput.nativeElement.click(); // Trigger the hidden file input
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      alert('Cannot upload multiple files');
      return;
    }

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = XLSX.utils.sheet_to_json(ws);

      const allErrors: string[] = [];
      this.addCompanyByExcel = this.data.map((row: any) => ({
        email: row['E- mail']?.toString() ?? '',        // Use the header 'E- mail'
        arName: row['اسم المنشآه']?.toString() ?? '',   // Use the header 'اسم المنشآه'
        enName: row['اسم المنشآه انجليزية']?.toString() ?? '', // Use the header 'اسم المنشآه انجليزية'
        compRegNumber: row['السجل التجاري ']?.toString() ?? '',  // Use the header 'السجل التجاري '
        governorate: row['المحافظة ']?.toString() ?? '',  // Use the header 'المحافظة '
        activity: row['النشاط']?.toString() ?? '',       // Use the header 'النشاط'
        wilaya: row['الولاية']?.toString() ?? '',        // Use the header 'الولاية'
        phoneNumber: row['هاتف']?.toString() ?? '',            // Use the header 'هاتف'
      }));

      this.companyHomeServices.AddCompanyByExcel(this.addCompanyByExcel).subscribe({
        next: (res: any) => {
          this.GetCompanies('', 1);
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
        }
      });
    };

    reader.readAsBinaryString(target.files[0]);
  }
  // Getter for the form array
  get compEmails(): FormArray {
    return this.companyForm.get('compEmails') as FormArray;
  }
  get isAddButtonDisabled(): boolean {
    return this.compEmails.controls.every(control => !control.value.Email);
  }
  // Method to create an email field
  createEmailField(): FormGroup {
    return this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]]
    });
  }

  // Method to add a new email field
  addEmailField(): void {
    this.compEmails.push(this.createEmailField());
  }

  // Method to remove an email field by index
  removeEmailField(index: number): void {
    if (this.compEmails.length > 1) {
      this.compEmails.removeAt(index);
    }
  }
  onPageChange(page: number) {

    this.currentPage = page;
    this.GetCompanies('', page);
  }
  GetSectorActvities(sectorId: number) {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.Activities = res.Data.getActivitiesDtos;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
      },
    };
    this.sectorsAndActivitiesServices.GetActivities(0, '', 0).subscribe(observer);
  }
  GetSubActivities(activityId: number) {
    if (activityId > 0) {
      const observer = {
        next: (res: any) => {
          if (res.Data) {
            this.SubActivities = res.Data.getSubActivitiesDtos;
          }
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
        },
      };
      this.sectorsAndActivitiesServices.GetSubActivities(0, '', activityId).subscribe(observer);
    }
  }
  GetCompanies(textSearch: string = '', page: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
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
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.companyHomeServices.GetCompanies(textSearch, page).subscribe(observer);
  }
  GetSectors(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.Sectors = res.Data.getSectorsDtos;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetSectors(0, '').subscribe(observer);
  }
  GetWilayat(govId: number) {
    if (govId > 0) {
      const observer = {
        next: (res: any) => {
          if (res.Data) {
            this.Wilayat = res.Data;
          }
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
        },
      };
      this.companyHomeServices.GetWilayat(govId).subscribe(observer);
    }
  }
  GetGovernorates() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.Governorates = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
      },
    };
    this.companyHomeServices.GetGovernorates().subscribe(observer);
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
        this.sharedService.handleError(err);
      },
    };
    this.companyHomeServices.GetCompanyCode().subscribe(observer);
  }
  generateRandomCredentials(): void {
    this.password = this.sharedService.generateRandomString(12); // Generate a 12 character password
  }
  saveCompany(): void {
    // Validate that at least one email is provided
    const regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    // Access the array of email objects
    const emailArray = this.companyForm.value.compEmails;
    // Filter out invalid emails
    if (emailArray.length > 0 && emailArray[0].Email != null) {
      const invalidEmails = emailArray.filter((item: any) => {
        // Ensure item is an object and has an Email property
        if (item && typeof item === 'object' && 'Email' in item) {
          const email = item.Email.trim(); // Get and trim the email string
          return !regexp.test(email); // Test the trimmed email against the regex
        }
        return true; // Consider non-objects or missing Email as invalid
      });
      if (invalidEmails.length > 0) {
        Swal.fire({
          icon: 'error',
          title: `${invalidEmails[0].Email} الايميل غير صالح`,
          html: '<small>يمكن أن يحتوي البريد الإلكتروني الصالح فقط على الأحرف والأرقام اللاتينية و "@" و "."</small>',
          showConfirmButton: false,
          timer: 2000
        });
        this.showLoader = false;
        return; // Stop the form submission      }
      }
    }
    const emailProvided = emailArray.some((email: any) => email.Email && email.Email.trim() !== '');
    if (this.companyForm.value.arName == '') {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال الاسم بالعربيه',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.enName == '') {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال الاسم بالانجليزية',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.activityId == 0) {
      Swal.fire({
        icon: 'error',
        title: 'يجب اختيار النشاط الرئيسي',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.sectorId == 0) {
      Swal.fire({
        icon: 'error',
        title: 'يجب اختيار القطاع',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.compRegNumber == '') {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال رقم التسجيل الضريبي',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.phoneNumber == '') {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال رقم الهاتف',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.phoneNumber.length != 8 ) {
      Swal.fire({
        icon: 'error',
        title: 'يجب ان يكون رقم الهاتف مكون من 8 ارقام',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.telNumber.length != 8 && this.companyForm.value.telNumber.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'يجب ان يكون رقم الهاتف الثابت مكون من 8 ارقام',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.fax.length != 8 && this.companyForm.value.fax.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'يجب ان يكون الفاكس مكون من 8 ارقام',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.governoratesId == 0) {
      Swal.fire({
        icon: 'error',
        title: 'يجب اختيار المحافظه',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.wilayatId == 0) {
      Swal.fire({
        icon: 'error',
        title: 'يجب اختيار الولايه',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (!emailProvided) {
      Swal.fire({
        icon: 'error',
        title: 'يجب إدخال بريد إلكتروني واحد على الأقل',
        showConfirmButton: false,
        timer: 2000
      });

      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.valid) {
      const Model: IAddCompany = {
        userName: this.companyForm.value.userName,
        password: this.companyForm.value.password,
        arName: this.companyForm.value.arName,
        enName: this.companyForm.value.enName,
        municipalityNumber: this.companyForm.value.municipalityNumber,
        compRegNumber: this.companyForm.value.compRegNumber,
        accountingPeriod: this.companyForm.value.accountingPeriod || null,  // Adjust this
        completionAccPeriod: this.companyForm.value.completionAccPeriod || null,  // Adjust this
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
        sectorId: this.sectorId,
        activityId: this.companyForm.value.activityId,
        subActivityId: this.companyForm.value.subActivityId,
        governoratesId: this.companyForm.get('governoratesId')?.value,
        wilayatId: this.companyForm.value.wilayatId,
        status: this.companyForm.value.status,
        companyEmails: this.companyForm.value.compEmails,
        facilityType: this.companyForm.value.facilityType,
        activityName: this.activityName,
        sectorName: this.sectorName,
        subActivityName: this.subActivityName,
      }
      debugger
      if (Model.subActivityId.toString() == "")
        Model.subActivityId = 0
      if (Model.legalType.toString() == "")
        Model.legalType = 0
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
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err: any) => {
          
          this.showLoader = false;
          this.sharedService.handleError(err);

        },
      };
      this.companyHomeServices.addCompany(Model).subscribe(observer);
    }
    else {
      
      const invalidFields: { [key: string]: any } = {}; // Store invalid fields and their errors

      Object.keys(this.companyForm.controls).forEach(key => {
        const control = this.companyForm.get(key);

        if (control && control.invalid) {
          invalidFields[key] = control.errors; // Store the field name and its errors
        }
      });
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال جميع البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
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
      accountingPeriod: '',
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
      status:true,
      email_2: '',
      email_1: '',
      compValue: '',
      compBuild: '',
      webSite: '',
      facilityType:'',
      activityName: '',
      sectorName: '',
      sectorCode: '',
      subActivityName: '',
    });
    if (this.companyForm.get('emails'))
      (this.companyForm.get('emails') as FormArray).clear();
    // إضافة حقل واحد فارغ على الأقل
    // this.addEmailField();
    this.generateRandomCredentials();
    this.GetCompanyCode();
  }
  resetFormWithAdd() {
    this.companyForm.reset({
      userName: '',
      password: '',
      arName: '',
      enName: '',
      municipalityNumber: '',
      compRegNumber: '',
      accountingPeriod: '',
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
      status:true,
      email_2: '',
      email_1: '',
      compValue: '',
      compBuild: '',
      webSite: '',
      facilityType:'',
      activityName: '',
      sectorName: '',
      subActivityName: '',
    });
    if (this.companyForm.get('emails'))
      (this.companyForm.get('emails') as FormArray).clear();    // إضافة حقل واحد فارغ على الأقل
    // this.addEmailField();

    this.add = true;

    this.generateRandomCredentials();
    this.GetCompanyCode();
  }
  popAddCompany() {
    this.GetSectors();
    this.GetGovernorates();
    this.generateRandomCredentials();
    if (this.add) {
      this.GetCompanyCode();
      this.resetForm();
    }
    this.companyForm.get('governoratesId')!.valueChanges.subscribe(value => {
      if (value != 0) {
        this.clearWilayat();
      }
      this.GetWilayat(value);
    });
  }
  DeleteCompany(id: number): void {
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

        this.DeleteCompany(id);
      }
    });
  }
  validateInput(event: KeyboardEvent) {
    this.sharedService.validateInput(event);
  }
  editCompany(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
        if (res.Data) {
          this.company = res.Data;
          this.GetSectorActivities_UpdatePop(this.company.sectorId, this.company.activityId);
          this.GetWilayat(this.company.governoratesId)
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
              status: this.company.status,
              facilityType: this.company.facilityType,
              activityName: this.company.activityName,
              sectorName: this.company.sectorName,
              subActivityName: this.company.subActivityName,
            });
            if(this.company.accountingPeriod != null)
            {
              this.companyForm.value.accountingPeriod = this.getDateOnly(this.company.accountingPeriod)
            }
            else{
              this.companyForm.value.accountingPeriod = this.company.accountingPeriod
            }
            if(this.company.completionAccPeriod !=null)
              {
                this.companyForm.value.completionAccPeriod = this.getDateOnly(this.company.completionAccPeriod)
              }
              else{
                this.companyForm.value.completionAccPeriod = this.company.completionAccPeriod
              }
            this.initializeForm();

          }

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
  // Method to initialize the form array
  initializeForm() {
    // Initialize the form array with non-empty emails
    this.compEmails.clear();
    this.company.companyEmails
      .filter((emailObj: ICompanyEmail) => emailObj.Email)  // Filter out empty emails
      .forEach((emailObj: ICompanyEmail) => {
        this.compEmails.push(this.formBuilder.group({ Email: [emailObj.Email] }));
      });

    // Remove the initial empty input if it exists
    if (this.compEmails.length > 0 && !this.compEmails.at(0).get('Email')?.value) {
      this.compEmails.removeAt(0);
    }
  }

  // Call this method when you need to initialize the form

  updateCompany() {
    this.showLoader = true;
    const emailArray = this.companyForm.value.compEmails;
    const emailProvided = emailArray.some((email: any) => email.Email && email.Email.trim() !== '');
    if (this.companyForm.value.sectorId == 0) {
      Swal.fire({
        icon: 'error',
        title: 'يجب القطاع',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.activityId == 0) {
      Swal.fire({
        icon: 'error',
        title: 'يجب النشاط الرئيسي',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.governoratesId == 0) {
      Swal.fire({
        icon: 'error',
        title: 'يجب رقم المنطقه',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.value.wilayatId == 0) {
      Swal.fire({
        icon: 'error',
        title: 'يجب رقم الولايه',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (!emailProvided) {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال بريد إلكتروني واحد على الأقل',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return; // Stop the form submission
    }
    else if (this.companyForm.valid) {
      debugger
      const Model: IAddCompany = {
        userName: this.companyForm.value.userName,
        password: this.companyForm.value.password,
        arName: this.companyForm.value.arName,
        enName: this.companyForm.value.enName,
        municipalityNumber: this.companyForm.value.municipalityNumber,
        compRegNumber: this.companyForm.value.compRegNumber,
        accountingPeriod: this.companyForm.value.accountingPeriod || null,  // Adjust this
        completionAccPeriod: this.companyForm.value.completionAccPeriod || null,  // Adjust this
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
        sectorId: this.sectorId,
        activityId: this.companyForm.value.activityId,
        subActivityId: this.companyForm.value.subActivityId,
        governoratesId: this.companyForm.get('governoratesId')?.value,
        wilayatId: this.companyForm.value.wilayatId,
        status: this.companyForm.value.status,
        companyEmails: this.companyForm.value.compEmails,
        facilityType: this.companyForm.value.facilityType,
        activityName: this.activityName,
        sectorName: this.sectorName,
        subActivityName: this.subActivityName,
      }
      if (Model.subActivityId.toString() == "")
        Model.subActivityId = 0
      debugger
      if(Model.legalType == null)
        Model.legalType = 0
      else if (Model.legalType.toString() == "")
        Model.legalType = 0
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
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
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
        item.phoneNumber,
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
      phoneNumber: company.phoneNumber,
      activityId: company.activityId,
      arActivityName: company.arActivityName,
      address: company.address,
      arName: company.arName,
      compRegNumber: company.compRegNumber,
      id: company.id
    }));
  }
  closePopup() {
    this.add = true;
    this.resetForm();
  }
  getDateOnly(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // إضافة صفر في حالة كان الشهر أقل من 10
    const day = ('0' + date.getDate()).slice(-2); // إضافة صفر في حالة كان اليوم أقل من 10
    return `${year}-${month}-${day}`;
  }
  
}