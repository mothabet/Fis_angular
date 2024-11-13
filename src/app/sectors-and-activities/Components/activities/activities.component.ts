import { Component, OnInit } from '@angular/core';
import { Validators } from 'ngx-editor';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IAddActivityDto, IGetSectorDto } from '../../Dtos/SectorDtos';
import Swal from 'sweetalert2';
import { PermissionsService } from 'src/app/permissions/services/permissions.service';
import { IGetPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {
  activityForm!: FormGroup;
  codeLengthError: boolean = false;
  showLoader: boolean = false;
  activities!: IGetSectorDto[];
  activity!: IGetSectorDto;
  categories!: IGetSectorDto[];
  isUpdate: boolean = false;
  id: number = 0;
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
  constructor(private sharedService: SharedService, private formBuilder: FormBuilder,
    private sectorsAndActivitiesServices: SectorAndActivitiesService,
    private permissionsService: PermissionsService) { }

  ngOnInit(): void {
    this.activityForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      categoryId: [0, Validators.required],
    });
    this.GetActivities(1, '',)
    this.GetSectors(1, '',)
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
  onSave() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.activityForm.value.arName == "" || this.activityForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم النشاط بالعربية');
    }
    if (this.activityForm.value.enName == "" || this.activityForm.value.enName == null) {
      allErrors.push("Activity Name in English is required.");
    }
    if (this.activityForm.value.code.length != 6) {
      this.codeLengthError = true;
      this.showLoader = false;
      return;
    }
    if (!(this.activityForm.value.categoryId > 0)) {
      allErrors.push('يجب اختيار اسم الفئة');
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
      const activity: IAddActivityDto = {
        arName: this.activityForm.value.arName,
        enName: this.activityForm.value.enName,
        code: this.activityForm.value.code,
        categoryId: this.activityForm.value.categoryId,
        sectorId: 0
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetActivities(1, '');
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
      this.sectorsAndActivitiesServices.AddActivity(activity).subscribe(observer);
    }
  }
  GetActivities(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.activities = res.Data.getActivitiesDtos;
          this.currentPage = res.Data.PageNumber;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.onReset();
        }
        else {
          this.activities = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetActivities(page, textSearch).subscribe(observer);
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetActivities(page);
  }
  countriesSearch() {
    this.GetActivities(this.currentPage, this.searchText);
  }
  GetSectors(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.categories = res.Data.categoryDtos;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetCategories(0, '').subscribe(observer);
  }
  DeleteActivity(id: number): void {
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
            this.GetActivities(1, '');
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
        this.sectorsAndActivitiesServices.DeleteActivity(id).subscribe(observer);
      }
    });
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.activity = res.Data;
          this.activityForm.patchValue({
            arName: this.activity.arName,
            enName: this.activity.enName,
            code: this.activity.code,
            categoryId: this.activity.categoryId
          });
          this.id = this.activity.id;
        }
        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetActivity(id).subscribe(observer);
  }
  updateActivity() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.activityForm.value.arName == "" || this.activityForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم النشاط بالعربية');
    }
    if (this.activityForm.value.enName == "" || this.activityForm.value.enName == null) {
      allErrors.push("Activity Name in English is required.");
    }
    if (this.activityForm.value.code == "" || this.activityForm.value.code == null) {
      allErrors.push('يجب ادخال رمز النشاط');
    }
    else if (this.activityForm.value.code.length != 6) {
      allErrors.push('يجب ان يكون رمز النشاط مكون من 6 ارقام');
    }
    if (!(this.activityForm.value.categoryId > 0)) {
      allErrors.push('يجب اختيار اسم القطاع');
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
      const Model: IAddActivityDto = {
        arName: this.activityForm.value.arName,
        enName: this.activityForm.value.enName,
        code: this.activityForm.value.code,
        categoryId: this.activityForm.value.categoryId,
        sectorId: 0
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetActivities(1);
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
      this.sectorsAndActivitiesServices.UpdateActivity(this.id, Model).subscribe(observer);
    }
  }
  getControlErrors(controlName: string): string[] {
    
    
    const control = this.activityForm.get(controlName);
    const errors: string[] = [];
    if (control && control.errors) {
      if (controlName == 'arName') controlName = 'اسم النشاط بالعربية';
      if (controlName == 'enName') controlName = 'Activity Name in English';
      if (controlName == 'code') controlName = 'رمز النشاط';
      if (controlName == 'categoryId') controlName = 'اسم الفئة';
      if (controlName == 'اسم القطاع' && control.errors['required']) {
        errors.push(`يجب اختيار ${controlName}`);
      }
      else if (control.errors['required']) {
        errors.push(`يجب ادخال ${controlName}`);
      }
    }
    return errors;
  }
  onReset(): void {
    this.isUpdate = false;
    this.activityForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code: ['', Validators.required],
      categoryId: 0,
    });
  }
  onlyNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }
}
