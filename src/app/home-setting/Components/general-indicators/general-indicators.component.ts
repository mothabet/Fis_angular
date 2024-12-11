import { Component, OnInit } from '@angular/core';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { CodeHomeService } from 'src/app/code/Services/code-home.service';
import { IDropdownList } from 'src/app/companies/Dtos/SharedDto';
import { ITableDto, ITableFieldDto } from 'src/app/Reports/Dtos/ReportDto';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { IAddGeneralIndicator, ISectorDto } from '../../Dtos/GeneralIndicatorDto';
import { GeneralIndicatorServicesService } from '../../Services/general-indicator-services.service';
import { SectorAndActivitiesService } from 'src/app/sectors-and-activities/Services/sector-and-activities.service';

@Component({
  selector: 'app-general-indicators',
  templateUrl: './general-indicators.component.html',
  styleUrls: ['./general-indicators.component.css']
})
export class GeneralIndicatorsComponent implements OnInit {
  isDropdownOpen = false;
  isSectorsDropdownOpen = false;
  searchTerm: string = '';
  sectorsSearchTerm: string = '';
  codeErrorMessage: string = '';
  chartErrorMessage: string = '';
  sectorErrorMessage: string = '';
  yearErrorMessage: string = '';
  filteredFormContents: ICode[] = [];
  sectorsSelected: ISectorDto[] = []
  codes: ICode[] = [];
  sectors: IDropdownList[] = []
  filteredSectors: IDropdownList[] = []
  yearFrom: number | undefined;
  yearTo: number | undefined;
  years: number[] = [
    2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017,
    2018, 2019, 2020, 2021, 2022, 2023, 2024
  ];
  selectSector: boolean = false;
  isYearError: boolean = false;
  isChartTypeError: boolean = false;
  isSectorError: boolean = false;
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
  chartType: number = 0; // القيمة الافتراضية
  constructor(private sharedService: SharedService, private sectorsAndActivitiesServices: SectorAndActivitiesService, private codeHomeService: CodeHomeService, private generalIndicatorServices: GeneralIndicatorServicesService) {

  }
  ngOnInit() {
    this.GetGeneralIndicators(1, '')
  }
  addGeneralIndicator() {
    this.GetAllCodes();
    this.GetSectors();
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  sectorsToggleDropdown() {
    this.isSectorsDropdownOpen = !this.isSectorsDropdownOpen;
  }
  filterFormContent() {
    this.filteredFormContents = this.codes.filter(code =>
      code.arName.includes(this.searchTerm)
    );
  }
  filterSectors() {
    this.filteredSectors = this.sectors.filter(code =>
      code.arName.includes(this.sectorsSearchTerm)
    );
  }
  selectFormContent(event: Event, code: any) {
    this.searchTerm = code.arName;
    this.isDropdownOpen = false;
  }
  SelectSector(event: Event, sector: any) {
    // تحقق إذا كان القطاع موجودًا بالفعل
    const sectorExists = this.sectorsSelected.some(
      (selectedSector) => selectedSector.name === sector.arName
    );

    if (!sectorExists) {
      // إذا لم يكن موجودًا، أضفه إلى القائمة
      this.sectorsSelected.push({
        name: sector.arName,
        code: sector.code // تحويل code إلى مصفوفة أرقام
      });
    }

    // تحديث البحث وغلق القائمة
    this.sectorsSearchTerm = sector.arName;
    this.isSectorsDropdownOpen = false;
  }
  GetAllCodes(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {

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
      this.codeErrorMessage = 'يجب اختيار مؤشر'
      return
    }
    else {
      this.isFormContentError = false;
      this.codeErrorMessage = ''
    }
    if (this.chartType == 0) {
      this.isChartTypeError = true;
      this.chartErrorMessage = 'يجب اختيار نوع الإحصاء'
      return
    }
    else {
      this.isChartTypeError = false;
      this.chartErrorMessage = ''
    }
    if (this.selectSector == true && (this.sectorsSearchTerm == '' || this.sectorsSearchTerm == undefined) && this.sectorsSelected.length == 0) {
      this.isSectorError = true;
      this.sectorErrorMessage = 'يجب اختيار القطاع '
      return
    }
    else {
      this.isSectorError = false;
      this.sectorErrorMessage = ''
    }
    if (this.yearFrom == 0 || this.yearFrom == undefined) {
      this.isYearError = true;
      this.yearErrorMessage = 'يجب اختيار سنة البداية'
      return
    }
    else {
      this.isYearError = false;
      this.yearErrorMessage = ''
    }
    if ((this.yearTo != undefined) && this.yearFrom > this.yearTo) {
      this.isYearError = true;
      this.yearErrorMessage = 'يجب اختيار سنة البداية اقل من سنة النهاية'
      return
    }
    else {
      this.isYearError = false;
      this.yearErrorMessage = ''
    }
    if (this.yearTo == undefined || this.yearTo == null)
      this.yearTo = 0;
    const generalIndicator: IAddGeneralIndicator = {
      codeId: this.codes.find(code => code.arName === this.searchTerm)?.Id!,
      codeName: this.searchTerm,
      yearFrom: this.yearFrom,
      yearTo: this.yearTo,
      chartType: this.chartType,
      sectorName: JSON.stringify(this.sectorsSelected),
      isSector: this.selectSector,
      sectorId: this.sectors.find(sector => sector.arName === this.sectorsSearchTerm)?.id!
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
    this.chartType = 0;
    this.selectSector = false;
    this.sectorsSearchTerm = '';
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
  setChartType(type: number): void {
    this.chartType = type;
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
          this.chartType = res.Data.chartType;
          this.searchTerm = res.Data.codeName;
          this.yearFrom = res.Data.yearFrom;
          this.yearTo = res.Data.yearTo;
          this.selectSector = res.Data.isSector;
          if (res.Data.sectorName != '')
            this.sectorsSelected = JSON.parse(res.Data.sectorName);
          this.id = res.Data.id;
          this.GetAllCodes();
          this.GetSectors();
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
      this.codeErrorMessage = 'يجب اختيار مؤشر'
      return
    }
    else {
      this.isFormContentError = false;
      this.codeErrorMessage = ''
    }
    if (this.chartType == 0) {
      this.isChartTypeError = true;
      this.chartErrorMessage = 'يجب اختيار نوع الإحصاء'
      return
    }
    else {
      this.isChartTypeError = false;
      this.chartErrorMessage = ''
    }
    if (this.selectSector == true && (this.sectorsSearchTerm == '' || this.sectorsSearchTerm == undefined) && this.sectorsSelected.length == 0) {
      this.isSectorError = true;
      this.sectorErrorMessage = 'يجب اختيار القطاع '
      return
    }
    else {
      this.isSectorError = false;
      this.sectorErrorMessage = ''
    }
    if (this.yearFrom == 0 || this.yearFrom == undefined) {
      this.isYearError = true;
      this.yearErrorMessage = 'يجب اختيار سنة البداية'
      return
    }
    else {
      this.isYearError = false;
      this.yearErrorMessage = ''
    }

    const Model: IAddGeneralIndicator = {
      codeId: this.codes.find(code => code.arName === this.searchTerm)?.Id!,
      codeName: this.searchTerm,
      yearFrom: this.yearFrom,
      yearTo: this.yearTo!,
      chartType: this.chartType,
      sectorName: JSON.stringify(this.sectorsSelected),
      isSector: this.selectSector,
      sectorId: this.sectors.find(sector => sector.arName === this.sectorsSearchTerm)?.id!
    };
    const observer = {
      next: (res: any) => {
        const button = document.getElementById('btnCancel');
        if (button) {
          button.click();
        }
        debugger
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
  GetSectors(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
          this.sectors = res.Data.getSectorsDtos;
          this.filteredSectors = res.Data.getSectorsDtos;
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
  removeSector(sector: any) {
    // Find the matching table in tables array based on enTableName
    const _sector = this.sectorsSelected.find((s: any) => s.name === sector.name);
    if (_sector) {
      // Filter out the field with matching name in the fields array of the found table
      this.sectorsSelected = this.sectorsSelected.filter((f: any) => f.name !== sector.name);
    }

  }
}
