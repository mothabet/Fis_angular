import { Component, OnInit } from '@angular/core';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { CodeHomeService } from 'src/app/code/Services/code-home.service';
import { IDropdownList } from 'src/app/companies/Dtos/SharedDto';
import { ITableDto, ITableFieldDto } from 'src/app/Reports/Dtos/ReportDto';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { IAddGeneralIndicator } from '../../Dtos/GeneralIndicatorDto';
import { GeneralIndicatorServicesService } from '../../Services/general-indicator-services.service';

@Component({
  selector: 'app-general-indicators',
  templateUrl: './general-indicators.component.html',
  styleUrls: ['./general-indicators.component.css']
})
export class GeneralIndicatorsComponent implements OnInit {
  isDropdownOpen = false;
  searchTerm: string = '';
  errorMessage: string = '';
  filteredFormContents: ICode[] = [];
  codes: ICode[] = [];
  yearFrom: number | undefined;
  yearTo: number | undefined;
  years: number[] = [
    2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
    2018, 2019, 2020, 2021, 2022, 2023, 2024
  ];
  isYearError: boolean = false;
  isFormContentError: boolean = false;
  showLoader: boolean = false;
  noData: boolean = false;
  generalIndicators!: any[];
  generalIndicator!: any;
  isUpdate: boolean = false;
  id: number = 0;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  searchText: string = '';
  constructor(private sharedService: SharedService, private codeHomeService: CodeHomeService, private generalIndicatorServices: GeneralIndicatorServicesService) {

  }
  ngOnInit() {
    this.GetGeneralIndicators(1, '')
  }
  addGeneralIndicator() {
    this.GetAllCodes();
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  filterFormContent() {
    this.filteredFormContents = this.codes.filter(code =>
      code.arName.includes(this.searchTerm)
    );
  }
  selectFormContent(event: Event, code: any) {
    this.searchTerm = code.arName;
    this.isDropdownOpen = false;
  }
  GetAllCodes(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
        if (res.Data) {
          this.codes = res.Data.getCodeDtos;
          this.filteredFormContents = res.Data.getCodeDtos;
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
  saveGeneralIndicator() {
    if (this.searchTerm == '' || this.searchTerm == undefined) {
      this.isFormContentError = true;
      this.errorMessage = 'يجب اختيار مؤشر'
      return
    }
    else {
      this.isFormContentError = false;
      this.errorMessage = ''
    }
    if (this.yearFrom == 0 || this.yearFrom == undefined) {
      this.isYearError = true;
      this.errorMessage = 'يجب اختيار سنة البداية'
      return
    }
    else {
      this.isYearError = false;
      this.errorMessage = ''
    }
    if ((this.yearTo != undefined) && this.yearFrom > this.yearTo) {
      this.isYearError = true;
      this.errorMessage = 'يجب اختيار سنة البداية اقل من سنة النهاية'
      return
    }
    else {
      this.isYearError = false;
      this.errorMessage = ''
    }
    if (this.yearTo == undefined || this.yearTo == null)
      this.yearTo = 0;
    const generalIndicator: IAddGeneralIndicator = {
      codeId: this.codes.find(code => code.arName === this.searchTerm)?.Id!,
      codeName: this.searchTerm,
      yearFrom: this.yearFrom,
      yearTo: this.yearTo
    };
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        this.onReset();
        const button = document.getElementById('btnCancel');
        if (button) {
          button.click();
        }
        this.GetGeneralIndicators(1, '');
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
    this.generalIndicatorServices.AddGeneralIndicator(generalIndicator).subscribe(observer);
  }
  onReset(): void {
    this.isUpdate = false;
    this.searchTerm = '';
    this.yearFrom = undefined;
    this.yearTo = undefined;
  }
  GetGeneralIndicators(page: number, textSearch: string = '') {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.generalIndicators = res.Data.getGeneralIndicatorDtos;
          this.currentPage = res.Data.PageNumber;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.onReset();
        }
        else {
          this.generalIndicators = [];
          this.noData = true;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.generalIndicatorServices.GetGeneralIndicators(page, textSearch).subscribe(observer);
  }
  DeleteGeneralIndicator(id: number): void {
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
            this.GetGeneralIndicators(1, '');
            this.showLoader = false;
            Swal.fire({
              icon: 'success',
              title: res.Message,
              showConfirmButton: true,
              confirmButtonText: 'اغلاق'
            });
          },
          error: (err: any) => {
            this.sharedService.handleError(err);
            this.showLoader = false;
          },
        };
        this.generalIndicatorServices.DeleteGeneralIndicator(id).subscribe(observer);
      }
    });
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetGeneralIndicators(page);
  }
  generalIndicatorsSearch() {
    this.GetGeneralIndicators(this.currentPage, this.searchText);
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
          this.searchTerm = res.Data.codeName;
          this.yearFrom = res.Data.yearFrom;
          this.yearTo = res.Data.yearTo;
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
    this.generalIndicatorServices.GetGeneralIndicator(id).subscribe(observer);
  }
  updateGeneralIndicator() {
    this.showLoader = true;
    if (this.searchTerm == '' || this.searchTerm == undefined) {
      this.isFormContentError = true;
      this.errorMessage = 'يجب اختيار مؤشر'
      return
    }
    else {
      this.isFormContentError = false;
      this.errorMessage = ''
    }
    if (this.yearFrom == 0 || this.yearFrom == undefined) {
      this.isYearError = true;
      this.errorMessage = 'يجب اختيار سنة البداية'
      return
    }
    else {
      this.isYearError = false;
      this.errorMessage = ''
    }

    const Model: IAddGeneralIndicator = {
      codeId: this.codes.find(code => code.arName === this.searchTerm)?.Id!,
      codeName: this.searchTerm,
      yearFrom: this.yearFrom,
      yearTo: this.yearTo!
    };
    const observer = {
      next: (res: any) => {
        const button = document.getElementById('btnCancel');
        if (button) {
          button.click();
        }
        this.onReset();
        this.GetGeneralIndicators(1);
        this.showLoader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: true,
          confirmButtonText: 'اغلاق'
        });
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.generalIndicatorServices.UpdateGeneralIndicator(this.id, Model).subscribe(observer);
  }
}
