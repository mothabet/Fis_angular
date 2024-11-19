import { Component, ElementRef, ViewChild } from '@angular/core';
import { ResearcherHomeService } from '../../services/researcher-home.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddResearcher, IResearcher } from '../../Dtos/ResearcherHomeDto';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { arabicFont } from 'src/app/shared/services/arabic-font';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { ICompany } from 'src/app/companies/Dtos/CompanyHomeDto';
import { PermissionsService } from 'src/app/permissions/services/permissions.service';
import { IGetPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';

@Component({
  selector: 'app-researcher-home',
  templateUrl: './researcher-home.component.html',
  styleUrls: ['./researcher-home.component.css']
})
export class ResearcherHomeComponent {
  private arabicCharMap: { [key: string]: string } = {
    'ء': 'ﺀ', 'آ': 'ﺁ', 'أ': 'ﺃ', 'ؤ': 'ﺅ', 'إ': 'ﺇ', 'ئ': 'ﺉ', 'ا': 'ﺍ', 'ب': 'ﺏ', 'ة': 'ﺓ', 'ت': 'ﺕ',
    'ث': 'ﺙ', 'ج': 'ﺝ', 'ح': 'ﺡ', 'خ': 'ﺥ', 'د': 'ﺩ', 'ذ': 'ﺫ', 'ر': 'ﺭ', 'ز': 'ﺯ', 'س': 'ﺱ', 'ش': 'ﺵ',
    'ص': 'ﺹ', 'ض': 'ﺽ', 'ط': 'ﻁ', 'ظ': 'ﻅ', 'ع': 'ﻉ', 'غ': 'ﻍ', 'ف': 'ﻑ', 'ق': 'ﻕ', 'ك': 'ﻙ', 'ل': 'ﻝ',
    'م': 'ﻡ', 'ن': 'ﻥ', 'ه': 'ﻩ', 'و': 'ﻭ', 'ي': 'ﻱ'
  };
  @ViewChild('addResearcher') addResearcherModal!: ElementRef;
  researcherForm!: FormGroup;
  username: string = '';
  searchText: string = '';
  password: string = '';
  researcherCode: number = 0;
  researchers: IResearcher[] = [];
  researcher!: IAddResearcher;
  showLoader: boolean = false;
  noData: boolean = false;
  add: boolean = true;
  id: number = 0;
  phoneCode: number = 968;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  tableColumns = ['رقم الهاتف', 'البريد الالكتروني', 'الاسم', 'الرقم'];
  companies: ICompany[] = [];
  selectedCompanyIds: Set<number> = new Set<number>();
  selectedCompanyIdsIsResearcher: Set<number> = new Set<number>();
  formStatics!: any[];
  formsStaticsStatus!: any[];
  filteredFormStatics: any[] = []; // البيانات المصفاة
  fromDate: Date | null = null;
  toDate: Date | null = null;
  permission: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany:true,
    addCompaniesGroup:true,
    copy:true,
    Instructions:true,
    FormNotes: true, 
    AddFormNotes:true, 
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionResearcherDetails: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany:true,
    addCompaniesGroup:true,
    copy:true,
    Instructions:true,
    FormNotes: true,  
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private researcherService: ResearcherHomeService,
    private sharedService: SharedService,
    private companyService: CompanyHomeService,
    private permissionsService: PermissionsService
  ) { }
  ngOnInit(): void {
    this.researcherForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      status: ['', Validators.required],
      phone: [
        '',
        [
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(8)
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
    });
    this.GetPermissionByUserId();
    this.GetPermissionResearcherDetailsByUserId();
    this.generateRandomCredentials();
    this.GetAllReseachers(this.currentPage);
    this.GetCompanies('', 0);
    this.GetFormsStatistics()
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetAllReseachers(page);
  }
  generateRandomCredentials(): void {
    this.showLoader = true;
    this.GetResearcherCode();
    this.researcherForm.patchValue({
      password: this.sharedService.generateRandomString(12) // Generate a 12 character password
    });
    this.showLoader = false;
  }
  saveResearcher(): void {
    this.showLoader = true;
    if (this.researcherForm.valid) {
      const Model: IAddResearcher = {
        userName: this.researcherForm.value.userName,
        password: this.researcherForm.value.password,
        arName: this.researcherForm.value.arName,
        enName: this.researcherForm.value.enName,
        status: this.researcherForm.value.status,
        phone: this.phoneCode + this.researcherForm.value.phone,
        email: this.researcherForm.value.email,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllReseachers(1);
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
      this.researcherService.addResearcher(Model).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'success',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
  GetResearcherCode(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.researcherForm.patchValue({
            userName: `FIS_R0${res.Data}`
          });
          this.showLoader = false;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherService.GetResearcherCode().subscribe(observer);
  }
  resetForm(): void {
    this.researcherForm.reset({
      userName: '',
      password: '',
      arName: '',
      enName: '',
      status: '', // Default value for status after reset
      phone: '',
      email: ''
    });
    this.generateRandomCredentials();
  }
  GetAllReseachers(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {

        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          debugger
          this.researchers = res.Data.getResearcherDtos;
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.resetForm();
        }
        else {
          this.researchers = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherService.GetAllReseachers(page, textSearch).subscribe(observer);
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
        this.DeleteReseacher(id);
      }
    });
  }

  DeleteReseacher(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllReseachers(1);
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
    this.researcherService.DeleteReseacher(id).subscribe(observer);
  }
  editResearcher(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {

        if (res.Data) {
          this.researcher = res.Data;
          this.researcher.phone = this.researcher.phone.replace(this.phoneCode.toString(), '');
          this.researcherForm.patchValue({
            userName: this.researcher.userName,
            password: this.researcher.password,
            arName: this.researcher.arName,
            enName: this.researcher.enName,
            status: this.researcher.status,
            phone: this.researcher.phone,
            email: this.researcher.email
          });
          this.showLoader = false;
          this.add = false;
          const button = document.getElementById('addResearcherBtn');
          if (button) {
            button.click();
          }
          this.id = id;
        }
      },
      error: (err: any) => {

        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherService.GetResearcherById(id).subscribe(observer);
  }
  updateResearcher() {
    this.showLoader = true;
    if (this.researcherForm.valid) {
      const Model: IAddResearcher = {
        userName: this.researcherForm.value.userName,
        password: this.researcherForm.value.password,
        arName: this.researcherForm.value.arName,
        enName: this.researcherForm.value.enName,
        status: this.researcherForm.value.status,
        phone: this.phoneCode + this.researcherForm.value.phone,
        email: this.researcherForm.value.email,
      };
      const observer = {
        next: (res: any) => {

          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllReseachers(1);
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
      this.researcherService.updateResearcher(this.id, Model).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }
  reset() {
    this.add = true;
    this.resetForm();
  }
  onlyNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }
  researcherSearch() {
    this.GetAllReseachers(this.currentPage, this.searchText);
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
    doc.text('الباحثين', 10, 10);

    // Generate the table
    autoTable(doc, {
      head: [columns],
      body: data.map((item, index) => [
        item.phone,
        item.email,
        item.arName,
        index + 1,
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
    doc.save('researchers.pdf');
  }
  fixArabic(text: string): string {
    return text.split('').map(char => this.arabicCharMap[char] || char).join('');
  }
  printPdf() {
    this.generatePdf(this.researchers, this.tableColumns);
  }
  GetCompanies(textSearch: string = '', page: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {

        this.showLoader = false;
debugger
        if (res.Data) {
          this.companies = res.Data.getCompaniesDtos;

        }
        else {
          this.companies = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {

        this.showLoader = false;
        this.sharedService.handleError(err);
      },
    };
    this.companyService.GetCompanies(textSearch, page).subscribe(observer);
  }
  onCheckboxChange(companyId: number, event: Event) {

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.selectedCompanyIds.add(companyId);
      this.selectedCompanyIdsIsResearcher.add(companyId);
    } else {
      this.selectedCompanyIds.delete(companyId);
      this.selectedCompanyIdsIsResearcher.delete(companyId);
    }
  }
  OpenCompany(id: number): void {
    this.id = id
    this.showLoader = true;
    this.selectedCompanyIds.clear();
    const observer = {
      next: (res: any) => {

        this.showLoader = false;

        if (res.Data) {

          for (let index = 0; index < res.Data.length; index++) {

            this.selectedCompanyIds.add(res.Data[index].id);
          }
          // res.Data.getCompaniesDtos.forEach((element:any) => {

          //   
          // });
        }
        this.GetCompaniesIsSelectedResearcher();
      },
      error: (err: any) => {

        this.showLoader = false;
        this.sharedService.handleError(err);
      },
    };
    this.companyService.GetCompaniesByResearcherId(id).subscribe(observer);
  }
  GetCompaniesIsSelectedResearcher(): void {
    this.showLoader = true;
    this.selectedCompanyIdsIsResearcher.clear();
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        if (res.Data) {
          for (let index = 0; index < res.Data.length; index++) {
            this.selectedCompanyIdsIsResearcher.add(res.Data[index].id);
          }
        }
        debugger
        this.showLoader = false;
      },
      error: (err: any) => {

        this.showLoader = false;
        this.sharedService.handleError(err);
      },
    };
    this.companyService.GetCompaniesIsSelectedResearcher().subscribe(observer);
  }
  saveSelectedCompanies() {
    const selectedCompanies = this.companies.filter(company => this.selectedCompanyIds.has(company.id));

    this.showLoader = true;
    if (selectedCompanies.length > 0) {

      const observer = {
        next: (res: any) => {

          const button = document.getElementById('btnCancelCompanyResearcher');
          if (button) {
            button.click();
          }
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

          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.companyService.UpdateCompanyToRecearcher(this.id, selectedCompanies).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب اختيار شركات',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
  companiesSearch() {
    this.GetCompanies(this.searchText, 1);
  }
  GetFormsStatistics() {


    if (this.fromDate && this.toDate && this.fromDate > this.toDate) {
      Swal.fire({
        icon: 'error',
        title: 'يجب أن يكون "من تاريخ" أصغر من "إلى تاريخ"',
        showConfirmButton: true,
        confirmButtonText: 'اغلاق'
      });
      return;
    }

    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        if (res.Data) {
          this.formStatics = res.Data;
          this.filteredFormStatics = this.formStatics;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherService.GetFormsStatistics(0, this.fromDate, this.toDate).subscribe(observer);
  }
  GetFormsByStatus(status: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        if (res.Data) {
          this.formsStaticsStatus = res.Data
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherService.GetFormsByStatus(0, status).subscribe(observer);
  }
  GetPermissionByUserId() {
    this.permissionsService.FunctionGetPermissionByUserId("Researcher").then(permissions => {
      this.permission = permissions;
    });
  }
  GetPermissionResearcherDetailsByUserId() {
    this.permissionsService.FunctionGetPermissionByUserId("Researcher-Details").then(permissions => {
      
      this.permissionResearcherDetails = permissions;
    });
  }
}