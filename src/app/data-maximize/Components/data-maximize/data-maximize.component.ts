import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { ToastrService } from 'ngx-toastr';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { CodeHomeService } from 'src/app/code/Services/code-home.service';
import { IAddReportDto, IGetReportDto } from 'src/app/Reports/Dtos/ReportDto';
import { ReportService } from 'src/app/Reports/Services/report.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { IAddDataMaximize } from '../../Dto/DataMaximizeDto';
import { MaximizeService } from '../../Services/maximize.service';
import { LaunchYearService } from 'src/app/home-setting/Services/launch-year.service';

@Component({
  selector: 'app-data-maximize',
  templateUrl: './data-maximize.component.html',
  styleUrls: ['./data-maximize.component.css']
})
export class DataMaximizeComponent {
  dataMaximizeForm!: FormGroup;
  showLoader: boolean = false;
  isUpdate: boolean = false;
  id: number = 0;
  isDropdownOpen = false;
  searchFormContentTerm: string = '';
  isFormContentDropdownOpen = false;
  filteredCodes: ICode[] = [];
  codes: ICode[] = [];
  years: number[] = [];
  dataMaximized: any[] = []
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  noData: boolean = false;
  searchText: string = '';
  // isArNameError = false;
  // isEnNameError = false;
  // isReviewYearError = false;
  // isTypeError = false;
  isError = false;
  errorMessage = '';
  launchYear = 0;
  savedLang: string = '';
  lang:number = 2;
  constructor(private sharedService: SharedService, private fb: FormBuilder, private codeHomeService: CodeHomeService,
    private toastr: ToastrService, private dataMaximizeServices: MaximizeService, private launchYearServices: LaunchYearService) { }
  ngOnInit(): void {
    this.savedLang = localStorage.getItem('language') || 'ar';
    this.lang = this.savedLang === 'ar' ? 2 : 1;
    this.dataMaximizeForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      reviewYear: [null, Validators.required],
      type: [0, Validators.required],
      codeName: ['', Validators.required],
    });
    this.GetDataMaxmizes(1)
  }
  onSave(): void {
    // this.isArNameError = false;
    // this.isEnNameError = false;
    // this.isReviewYearError = false;
    // this.isTypeError = false;
    this.isError = false;
    this.errorMessage = ''
    if (this.dataMaximizeForm.value.arName === '') {
      this.isError = true;
      this.errorMessage = 'يجب ادخال الاسم بالعربية';
      return;
    }
    if (this.dataMaximizeForm.value.enName === '') {
      this.isError = true;
      this.errorMessage = 'يجب ادخال الاسم بالانجليزية';
      return;
    }
    if (this.dataMaximizeForm.value.codeName === '') {
      this.isError = true;
      this.errorMessage = 'يجب اختيار المؤشر';
      return;
    }
    if (this.dataMaximizeForm.value.reviewYear === '' || this.dataMaximizeForm.value.reviewYear === null) {
      this.isError = true;
      this.errorMessage = 'يجباختيار سنة المسح';
      return;
    }

    if (this.dataMaximizeForm.value.type === 0) {
      this.isError = true;
      this.errorMessage = 'يجب اختيار نوع المسح';
      return;
    }
    if (this.dataMaximizeForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.dataMaximizeForm.markAllAsTouched();
      return;
    }
    const formData = {
      ...this.dataMaximizeForm.value,
      type: +this.dataMaximizeForm.value.type,             // Convert to number
    };
    formData.codeId = this.codes.find(c => c.arName === this.dataMaximizeForm.value.codeName)?.Id;
    // Submit data to the server
    this.showLoader = true;
    this.dataMaximizeServices.AddDataMaxmize(formData,this.lang).subscribe({
      next: (res: any) => {
        document.getElementById('btnCancel')?.click();
        this.GetDataMaxmizes(1, '');
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
    });
  }
  GetDataMaxmizes(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.noData = false;
          this.dataMaximized = res.Data.getDataMaxmizeDtos;
          this.currentPage = res.Data.PageNumber;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.onReset();
        }
        else {
          this.dataMaximized = []
          this.noData = true
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.dataMaximizeServices.GetDataMaxmizes(page, textSearch , this.lang).subscribe(observer);
  }
  onReset(add: number = 0): void {
    this.dataMaximizeForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      reviewYear: [null, Validators.required],
      type: [0, Validators.required],
      codeName: ['', Validators.required]
    });
    if (add == 1) {
      this.isUpdate = false;
    }
  }
  DeleteDataMaxmize(id: number): void {
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
        this.showLoader = true;
        const observer = {
          next: (res: any) => {
            this.GetDataMaxmizes(1, '');
            this.showLoader = false;
          },
          error: (err: any) => {
            this.sharedService.handleError(err);
            this.showLoader = false;
          },
        };
        this.dataMaximizeServices.DeleteDataMaxmize(id,this.lang).subscribe(observer);
      }
    });
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetDataMaxmizes(page);
  }
  dataMaximizeSearch() {
    this.GetDataMaxmizes(this.currentPage, this.searchText);
  }
  toggleFormContentDropdown() {
    this.isFormContentDropdownOpen = !this.isFormContentDropdownOpen;
  }
  filterSubCodes() {

    this.filteredCodes = this.codes.filter(code =>
      code.arName.includes(this.searchFormContentTerm)
    );
  }
  selectCode(code: any) {
    this.searchFormContentTerm = code.arName; // Update the input field's search term
    this.dataMaximizeForm.get('codeName')?.setValue(code.arName); // Update the form control value
    this.isFormContentDropdownOpen = false; // Close the dropdown
  }
  GetAllCodes(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.codes = res.Data.getCodeDtos;
          this.filteredCodes = res.Data.getCodeDtos;
        }
        else {
          this.codes = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.codeHomeService.GetAllCodes(0).subscribe(observer);
  }
  openPopup() {
    this.onReset(1);
    this.GetAllCodes();
    this.GetLaunchYear()

  }
  GetLaunchYear(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.launchYear = res.Data
          const currentYear = new Date().getFullYear();
          this.years = Array.from({ length: currentYear - this.launchYear + 1 }, (_, i) => this.launchYear + i);
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.launchYearServices.GetLaunchYear().subscribe(observer);
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    this.isUpdate = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          const startYear = 2007;
          const currentYear = new Date().getFullYear();
          this.years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
          this.GetAllCodes();
          // Patch the form with the retrieved data
          this.dataMaximizeForm.patchValue({
            arName: res.Data.arName,
            enName: res.Data.enName,
            reviewYear: +res.Data.reviewYear,
            type: res.Data.type,
            codeName: res.Data.codeName,
          });

          // Update other variables if needed
          this.searchFormContentTerm = res.Data.codeName;
          this.id = res.Data.id;
        }

        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };

    this.dataMaximizeServices.GetDataMaxmize(id).subscribe(observer);
  }
  updateDataMaximize() {
    if (this.dataMaximizeForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى تعبئة جميع الحقول المطلوبة',
        showConfirmButton: true,
        confirmButtonText: 'إغلاق'
      });
      return;
    }

    // جلب القيم من النموذج
    const formData = { ...this.dataMaximizeForm.value };

    const Model: IAddDataMaximize = {
      codeId: this.codes.find(code => code.arName === formData.codeName)?.Id!,
      ...formData,
      reviewYear: formData.reviewYear?.toString(), // Ensure reviewYear is a string
      type: Number(formData.type),               // Ensure type is a number
    };

    this.showLoader = true;

    const observer = {
      next: (res: any) => {
        this.onReset();
        this.GetDataMaxmizes(1);
        document.getElementById('btnCancel')?.click();
        this.showLoader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: true,
          confirmButtonText: 'إغلاق'
        });
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      }
    };

    this.dataMaximizeServices.UpdateDataMaxmize(this.id, Model, this.lang).subscribe(observer);
  }

}
