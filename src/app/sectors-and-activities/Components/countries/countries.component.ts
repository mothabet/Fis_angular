import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddCountryDto, IAddSectorDto, IGetCountryDto, IGetSectorDto } from '../../Dtos/SectorDtos';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';
import Swal from 'sweetalert2';
import { IGetPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';
import { PermissionsService } from 'src/app/permissions/services/permissions.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {
  countryForm!: FormGroup;
  showLoader: boolean = false;
  countries!:IGetCountryDto[];
  country!:IAddCountryDto;
  getcountry!:IGetCountryDto;
  isUpdate: boolean = false;
  id:number=0;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  searchText: string = '';
  noData: boolean = false;
  permissionSectors: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany: true,
    addCompaniesGroup: true,
    copy: true,
    Instructions: true,
    FormNotes: true,  
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionSections: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany: true,
    addCompaniesGroup: true,
    copy: true,
    Instructions: true,
    FormNotes: true,  
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionGroups: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany: true,
    addCompaniesGroup: true,
    copy: true,
    Instructions: true,
    FormNotes: true,  
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionCategories: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany: true,
    addCompaniesGroup: true,
    copy: true,
    Instructions: true,
    FormNotes: true,  
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionActivities: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany: true,
    addCompaniesGroup: true,
    copy: true,
    Instructions: true,
    FormNotes: true,  
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionCountries: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany: true,
    addCompaniesGroup: true,
    copy: true,
    Instructions: true,
    FormNotes: true,  
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionGovernorates: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany: true,
    addCompaniesGroup: true,
    copy: true,
    Instructions: true,
    FormNotes: true,
    AddFormNotes: true,
    Approve: true,
    Complete: true,
    Close: true,
    Open: true
  };
  permissionWilayat: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany: true,
    addCompaniesGroup: true,
    copy: true,
    Instructions: true,
    FormNotes: true,
    AddFormNotes: true,
    Approve: true,
    Complete: true,
    Close: true,
    Open: true
  };
  constructor(private sharedService: SharedService,private fb: FormBuilder,
    private sectorsAndActivitiesServices:SectorAndActivitiesService,
    private permissionsService: PermissionsService) {}

  ngOnInit(): void {
    this.countryForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required],
      countryPhone:['',Validators.required]
    });
    this.GetCountries(1,'',);
    this.GetPermissionByUserIdSectors();
    this.GetPermissionByUserIdSections();
    this.GetPermissionByUserIdGroups();
    this.GetPermissionByUserIdCategories();
    this.GetPermissionByUserIdActivities();
    this.GetPermissionByUserIdCountries();
  }
  GetPermissionByUserIdSectors() {
    this.permissionsService.FunctionGetPermissionByUserId("Sectors").then(permissions => {
      this.permissionSectors = permissions;
    });
  }
  GetPermissionByUserIdSections() {
    this.permissionsService.FunctionGetPermissionByUserId("Sections").then(permissions => {
      this.permissionSections = permissions;
    });
  }
  GetPermissionByUserIdGroups() {
    this.permissionsService.FunctionGetPermissionByUserId("Groups").then(permissions => {
      this.permissionGroups = permissions;
    });
  }
  GetPermissionByUserIdCategories() {
    this.permissionsService.FunctionGetPermissionByUserId("Categories").then(permissions => {
      this.permissionCategories = permissions;
    });
  }
  GetPermissionByUserIdActivities() {
    this.permissionsService.FunctionGetPermissionByUserId("Activities").then(permissions => {
      this.permissionActivities = permissions;
    });
  }
  GetPermissionByUserIdCountries() {
    this.permissionsService.FunctionGetPermissionByUserId("Countries").then(permissions => {
      this.permissionCountries = permissions;
    });
  }
  GetPermissionByUserIdGovernorates() {
    this.permissionsService.FunctionGetPermissionByUserId("Governorates").then(permissions => {
      this.permissionGovernorates = permissions;
    });
  }
  GetPermissionByUserIdWilayat() {
    this.permissionsService.FunctionGetPermissionByUserId("Wilayat").then(permissions => {
      this.permissionWilayat = permissions;
    });
  }
  onSave(): void {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.countryForm.value.arName == "" || this.countryForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم الدوله بالعربية');
    }
    if (this.countryForm.value.enName == "" || this.countryForm.value.enName == null) {
      allErrors.push("Country Name in English is required.");
    }
    if (this.countryForm.value.code == "" || this.countryForm.value.code == null) {
      allErrors.push('يجب ادخال رمز الدولة');
    }
    if (this.countryForm.value.countryPhone == "" || this.countryForm.value.countryPhone == null) {
      allErrors.push('يجب ادخال رقم الدولة');
    }
    if (allErrors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: allErrors.join('<br>'),
        showConfirmButton: true,
        confirmButtonText: 'اغلاق'
      });
      this.showLoader = false;
    }
    else {
      const country : IAddCountryDto = {
        arName : this.countryForm.value.arName,
        enName : this.countryForm.value.enName,
        code : this.countryForm.value.code,
        countryPhone : this.countryForm.value.countryPhone,
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetCountries(1,'');
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
      this.sectorsAndActivitiesServices.AddCountry(country).subscribe(observer);
    } 
  }
  GetCountries(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.countries = res.Data.getCountryDtos;
          this.currentPage = res.Data.PageNumber;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.onReset();
        }
        else{
          this.countries = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetCountries(page, textSearch).subscribe(observer);
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetCountries(page);
  }
  countriesSearch() {
    this.GetCountries(this.currentPage, this.searchText);
  }
  onReset(): void {
    this.isUpdate = false;
    this.countryForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required],
      countryPhone:['',Validators.required]
    });
  }
  DeleteCountry(id: number): void {
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
            this.GetCountries(1,'');
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
        this.sectorsAndActivitiesServices.DeleteCountry(id).subscribe(observer);
      }
    });
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.getcountry = res.Data;
          this.countryForm.patchValue({
            arName: this.getcountry.arName,
            enName: this.getcountry.enName,
            code: this.getcountry.code,
            countryPhone:this.getcountry.countryPhone
          });
          this.id = this.getcountry.id;
        }
        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetCountry(id).subscribe(observer);
  }
  updateCountry() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.countryForm.value.arName == "" || this.countryForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم الدوله بالعربية');
    }
    if (this.countryForm.value.enName == "" || this.countryForm.value.enName == null) {
      allErrors.push("Country Name in English is required.");
    }
    if (this.countryForm.value.code == "" || this.countryForm.value.code == null) {
      allErrors.push('يجب ادخال رمز الدولة');
    }
    if (this.countryForm.value.countryPhone == "" || this.countryForm.value.countryPhone == null) {
      allErrors.push('يجب ادخال رقم الدولة');
    }
    if (allErrors.length > 0) {
      Swal.fire({
        icon: 'error',
        title: allErrors.join('<br>'),
        showConfirmButton: true,
        confirmButtonText: 'اغلاق'
      });
      this.showLoader = false;
    }
    else {
      const Model: IAddCountryDto = {
        arName: this.countryForm.value.arName,
        enName: this.countryForm.value.enName,
        code: this.countryForm.value.code,
        countryPhone: this.countryForm.value.countryPhone,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetCountries(1);
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
      this.sectorsAndActivitiesServices.UpdateCountry(this.id, Model).subscribe(observer);
    }
  }
}
