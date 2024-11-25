import { Component, OnInit } from '@angular/core';
import { CodeHomeService } from 'src/app/code/Services/code-home.service';
import { IDropdownList } from 'src/app/companies/Dtos/SharedDto';
import { SectorAndActivitiesService } from 'src/app/sectors-and-activities/Services/sector-and-activities.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddOmanMap } from '../../Dtos/GeneralIndicatorDto';
import Swal from 'sweetalert2';
import { GeneralIndicatorServicesService } from '../../Services/general-indicator-services.service';

@Component({
  selector: 'app-oman-maps',
  templateUrl: './oman-maps.component.html',
  styleUrls: ['./oman-maps.component.css']
})
export class OmanMapsComponent implements OnInit {
  showLoader: boolean = false;
  Governorates: IDropdownList[] = []
  searchGovernorateTerm: string = ''
  GovernoratesFiltered: IDropdownList[] = []
  isGovernorateDropdownOpen = false;
  Wilayat: IDropdownList[] = []
  searchWilayatTerm: string = ''
  WilayatFiltered: IDropdownList[] = []
  wilayatList: IDropdownList[] = []
  isWilayatDropdownOpen = false;
  Codes: IDropdownList[] = []
  searchCodeTerm: string = ''
  CodesFiltered: IDropdownList[] = []
  codesList: IDropdownList[] = []
  isCodesDropdownOpen = false;
  omanGovernorates: IAddOmanMap ={
    governorateId: 0,
    codesId:[],
    wilayatId:[]
  };
  isUpdate: boolean = false;
  noData: boolean = false;
  omanGovernarates!: any[];
  id: number = 0;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  searchText: string = '';
  /**
   *
   */
  constructor(private codeHomeService: CodeHomeService, private generalIndicatorServices: GeneralIndicatorServicesService, private sharedService: SharedService, private sectorsAndActivitiesServices: SectorAndActivitiesService) {

  }
  ngOnInit(): void {
    this.GetGovernorates();
    this.GetAllCodes();
    this.GetOmanGovernorate(1, '')
  }
  GetGovernorates() {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.Governorates = res.Data.getGovernoratesDto;
          this.GovernoratesFiltered = res.Data.getGovernoratesDto;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetGovernorates(0, '').subscribe(observer);
  }
  toggleGovenorateDropdown() {
    this.isGovernorateDropdownOpen = !this.isGovernorateDropdownOpen;
    this.isWilayatDropdownOpen = false;
    this.isCodesDropdownOpen = false;
  }
  filterGovernorates() {
    this.GovernoratesFiltered = this.Governorates.filter(code =>
      code.arName.includes(this.searchGovernorateTerm)
    );
  }
  selectGovernorate(event: Event, governorates: any) {
    this.GetWilayat(governorates.id)
    this.searchGovernorateTerm = governorates.arName;
    this.isGovernorateDropdownOpen = false;
  }
  GetWilayat(govId: number) {

    if (govId > 0) {
      this.showLoader = true;
      const observer = {
        next: (res: any) => {
          if (res.Data) {
            this.Wilayat = res.Data.getWilayaDtos;
            this.WilayatFiltered = res.Data.getWilayaDtos;
          }
          this.showLoader = false;
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.sectorsAndActivitiesServices.GetWilayats(govId, 0, '').subscribe(observer);
    }
  }
  toggleWilayatDropdown() {
    this.isWilayatDropdownOpen = !this.isWilayatDropdownOpen;
    this.isCodesDropdownOpen = false;
    this.isGovernorateDropdownOpen = false;
  }
  filterWilayat() {
    this.WilayatFiltered = this.Wilayat.filter(code =>
      code.arName.includes(this.searchWilayatTerm)
    );
  }
  selectWilaya(event: Event, wilaya: any) {
    this.searchWilayatTerm = wilaya.arName;
    this.isWilayatDropdownOpen = false;
    const selectedField = this.Wilayat.find(field => field.arName === wilaya.arName);
    if (selectedField && this.wilayatList) {
      const fieldExists = this.wilayatList.some(field => field.arName === selectedField.arName);
      if (!fieldExists) {
        const wilaya: IDropdownList = {
          arName: selectedField.arName,
          enName: selectedField.enName,
          id: selectedField.id,
          code: selectedField.code
        };
        // Check if the field already exists in the table's fields array
        this.wilayatList.push(wilaya);
        this.omanGovernorates.wilayatId.push(wilaya.id);
      }
    }
  }
  GetAllCodes(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.Codes = res.Data.getCodeDtos;
          this.CodesFiltered = res.Data.getCodeDtos;
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
  toggleCodesDropdown() {
    this.isCodesDropdownOpen = !this.isCodesDropdownOpen;
    this.isGovernorateDropdownOpen = false;
    this.isWilayatDropdownOpen = false;
  }
  filterCodes() {
    this.CodesFiltered = this.Codes.filter(code =>
      code.arName.includes(this.searchWilayatTerm)
    );
  }
  selectCodes(event: Event, code: any) {
    this.searchCodeTerm = code.arName;
    this.isCodesDropdownOpen = false;
    const selectedField = this.Codes.find(field => field.arName === code.arName) as any;
    if (selectedField && this.codesList) {
      const fieldExists = this.codesList.some(field => field.arName === selectedField.arName);
      if (!fieldExists) {
        const code: IDropdownList = {
          arName: selectedField.arName,
          enName: selectedField.enName,
          id: selectedField.Id,
          code: selectedField.code
        };
        debugger
        // Check if the field already exists in the table's fields array
        this.codesList.push(code);
        this.omanGovernorates.codesId.push(code.id);
      }
    }
  }
  removeCode(field: any) {
    this.codesList = this.codesList.filter((f: any) => f.name !== field.name);
    this.omanGovernorates.codesId = this.omanGovernorates.codesId.filter((f: any) => f !== field.id);
  }
  removeWilaya(field: any) {
    this.wilayatList = this.wilayatList.filter((f: any) => f.name !== field.name);
    this.omanGovernorates.wilayatId = this.omanGovernorates.wilayatId.filter((f: any) => f !== field.id);
  }
  saveOmanGovernorate() {
    debugger
    if(this.searchGovernorateTerm != '' && this.searchGovernorateTerm != undefined && this.searchGovernorateTerm != null){
      const selectedField = this.Governorates.find(field => field.arName === this.searchGovernorateTerm) as any;
      if (selectedField) {
        this.omanGovernorates.governorateId = selectedField.id;
      }
    }
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        this.onReset();
        const button = document.getElementById('btnCancel');
        if (button) {
          button.click();
        }
        // this.GetGeneralIndicators(1, '');
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
    this.generalIndicatorServices.AddOmanGovernorate(this.omanGovernorates).subscribe(observer);
  }
  onReset(): void {
    this.omanGovernorates.codesId = [];
    this.omanGovernorates.wilayatId = [];
    this.omanGovernorates.governorateId = 0;
    this.searchGovernorateTerm = '';
    this.searchCodeTerm = '';
    this.searchWilayatTerm = '';
    this.codesList = [];
    this.wilayatList =[];
    this.isUpdate = false;
  }
  GetOmanGovernorate(page: number, textSearch: string = '') {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          debugger
          this.omanGovernarates = res.Data.getOmanMapDtos;
          this.currentPage = res.Data.PageNumber;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.onReset();
        }
        else {
          this.omanGovernarates = [];
          this.noData = true;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.generalIndicatorServices.GetOmanMaps(page, textSearch).subscribe(observer);
  }
  omanGovernoratesSearch() {
    this.GetOmanGovernorate(this.currentPage, this.searchText);
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetOmanGovernorate(page);
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
            this.GetOmanGovernorate(1, '');
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
        this.generalIndicatorServices.DeleteOmanMap(id).subscribe(observer);
      }
    });
  }
}
