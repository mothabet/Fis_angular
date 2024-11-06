import { Component, OnInit } from '@angular/core';
import { Validators } from 'ngx-editor';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IAddGroupDto, IGetGroupDto, IGetSectorDto } from '../../Dtos/SectorDtos';
import Swal from 'sweetalert2';
import { PermissionsService } from 'src/app/permissions/services/permissions.service';
import { IGetPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';
@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  groupForm!: FormGroup;
  showLoader: boolean = false;
  groups!: IGetSectorDto[];
  group!: IGetGroupDto;
  sections!: IGetGroupDto[];
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
  constructor(private sharedService: SharedService, private formBuilder: FormBuilder,
  private sectorsAndActivitiesServices: SectorAndActivitiesService,
  private permissionsService: PermissionsService) { }

  ngOnInit(): void {
    this.groupForm = this.formBuilder.group({
      code: ['', Validators.required],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      sectionId: [0, Validators.required],
    });
    this.GetGroups(1, '',)
    this.GetSections(1, '',);
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

  onSave() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.groupForm.value.arName == "" || this.groupForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم المجموعة بالعربية');
    }
    if (this.groupForm.value.enName == "" || this.groupForm.value.enName == null) {
      allErrors.push("Group Name in English is required.");
    }
    if (this.groupForm.value.code == "" || this.groupForm.value.code == null) {
      allErrors.push('يجب ادخال رمز المجموعة');
    }
    if (!(this.groupForm.value.sectionId > 0)) {
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
      const activity: IAddGroupDto = {
        arName: this.groupForm.value.arName,
        enName: this.groupForm.value.enName,
        code: this.groupForm.value.code,
        sectionId: this.groupForm.value.sectionId,
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetGroups(1, '');
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
      this.sectorsAndActivitiesServices.AddGroup(activity).subscribe(observer);
    }
  }
  GetGroups(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.groups = res.Data.GroupDtos;
          this.currentPage = res.Data.PageNumber;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.onReset();
        }
        else{
          this.groups = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetGroups(page, textSearch).subscribe(observer);
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetGroups(page);
  }
  countriesSearch() {
    this.GetGroups(this.currentPage, this.searchText);
  }
  GetSections(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.sections = res.Data.sectionDto;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetSections(0, '').subscribe(observer);
  }
  DeleteGroup(id: number): void {
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
            this.GetGroups(1, '');
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
        this.sectorsAndActivitiesServices.DeleteGroup(id).subscribe(observer);
      }
    });
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          
          
          this.group = res.Data;
          this.groupForm.patchValue({
            arName: this.group.arName,
            enName: this.group.enName,
            code: this.group.code,
            sectionId: this.group.sectionId
          });
          this.id = this.group.id;
        }
        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetGroup(id).subscribe(observer);
  }
  updateGroup() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.groupForm.value.arName == "" || this.groupForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم المجموعة بالعربية');
    }
    if (this.groupForm.value.enName == "" || this.groupForm.value.enName == null) {
      allErrors.push("Group Name in English is required.");
    }
    if (this.groupForm.value.code == "" || this.groupForm.value.code == null) {
      allErrors.push('يجب ادخال رمز المجموعة');
    }
    else if (this.groupForm.value.code.length != 6) {
      allErrors.push('يجب ان يكون رمز النشاط مكون من 6 ارقام');
    }
    if (!(this.groupForm.value.sectionId > 0)) {
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
      const Model: IAddGroupDto = {
        arName: this.groupForm.value.arName,
        enName: this.groupForm.value.enName,
        code: this.groupForm.value.code,
        sectionId: this.groupForm.value.sectionId,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetGroups(1);
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
      this.sectorsAndActivitiesServices.UpdateGroup(this.id, Model).subscribe(observer);
    } 
  }
  getControlErrors(controlName: string): string[] {
    const control = this.groupForm.get(controlName);
    const errors: string[] = [];
    if (control && control.errors) {
      if (controlName == 'arName') controlName = 'اسم المجموعة بالعربية';
      if (controlName == 'enName') controlName = 'Category Name in English';
      if (controlName == 'code') controlName = 'رمز المجموعة';
      if (controlName == 'sectionId') controlName = 'اسم القطاع';
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
    this.groupForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      code : ['', Validators.required],
      sectionId : 0,
    });    
  }
  onlyNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }
}
