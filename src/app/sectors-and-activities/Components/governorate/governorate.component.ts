import { Component } from '@angular/core';
import { IGetPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';
import { PermissionsService } from 'src/app/permissions/services/permissions.service';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IAddGovernorateDto, IGetGovernorateDto } from '../../Dtos/SectorDtos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-governorate',
  templateUrl: './governorate.component.html',
  styleUrls: ['./governorate.component.css']
})
export class GovernorateComponent {
  showLoader: boolean = false;
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
    AddFormNotes:true,
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
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  governorateForm!: FormGroup;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  searchText: string = '';
  noData: boolean = false;
  governorates : IGetGovernorateDto[] = [];
  getGovernorate : IGetGovernorateDto = {
    id:0,
    arName:'',
    enName:''
  };
  isUpdate: boolean = false;
  id:number=0;

  constructor(private sharedService: SharedService,private fb: FormBuilder,
    private sectorsAndActivitiesServices:SectorAndActivitiesService,
    private permissionsService: PermissionsService) {}
    ngOnInit(): void {
      this.governorateForm = this.fb.group({
        arName: ['', Validators.required],
        enName: ['', Validators.required],
      });
      this.GetGovernorates(1,'',);
      this.GetPermissionByUserIdSectors();
      this.GetPermissionByUserIdSections();
      this.GetPermissionByUserIdGroups();
      this.GetPermissionByUserIdCategories();
      this.GetPermissionByUserIdActivities();
      this.GetPermissionByUserIdCountries();
      this.GetPermissionByUserIdGovernorates();
      this.GetPermissionByUserIdWilayat();
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
      if (this.governorateForm.value.arName == "" || this.governorateForm.value.arName == null) {
        allErrors.push('يجب ادخال اسم المحافظه بالعربية');
      }
      if (this.governorateForm.value.enName == "" || this.governorateForm.value.enName == null) {
        allErrors.push("Governorate Name in English is required.");
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
        const governorate : IAddGovernorateDto = {
          arName : this.governorateForm.value.arName,
          enName : this.governorateForm.value.enName,
        }
        const observer = {
          next: (res: any) => {
            const button = document.getElementById('btnCancel');
            if (button) {
              button.click();
            }
            this.onReset();
            this.GetGovernorates(1,'');
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
        this.sectorsAndActivitiesServices.AddGovernorate(governorate).subscribe(observer);
      } 
    }
    GetGovernorates(page: number, textSearch: string = ''): void {
      this.showLoader = true;
      const observer = {
        next: (res: any) => {
          this.noData = !res.Data || res.Data.length === 0;
          if (res.Data) {
            this.governorates = res.Data.getGovernoratesDto;
            this.currentPage = res.Data.PageNumber;
            this.isLastPage = res.Data.LastPage;
            this.totalPages = res.Data.TotalCount;
            this.onReset();
          }
          else{
            this.governorates = [];
          }
          this.showLoader = false;
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.sectorsAndActivitiesServices.GetGovernorates(page, textSearch).subscribe(observer);
    }
    onPageChange(page: number) {
      this.currentPage = page;
      this.GetGovernorates(page);
    }
    governoratesSearch() {
      this.GetGovernorates(this.currentPage, this.searchText);
    }
    onReset(): void {
      this.isUpdate = false;
      this.governorateForm = this.fb.group({
        arName: ['', Validators.required],
        enName: ['', Validators.required],
      });
    }
    DeleteGovernorate(id: number): void {
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
              this.GetGovernorates(1,'');
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
          this.sectorsAndActivitiesServices.DeleteGovernorate(id).subscribe(observer);
        }
      });
    }
    openUpdatePopup(id: number) {
      this.showLoader = true;
      const observer = {
        next: (res: any) => {
          if (res.Data) {
            this.getGovernorate = res.Data;
            this.governorateForm.patchValue({
              arName: this.getGovernorate.arName,
              enName: this.getGovernorate.enName,
            });
            this.id = this.getGovernorate.id;
          }
          this.isUpdate = true;
          this.showLoader = false;
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.sectorsAndActivitiesServices.GetGovernorate(id).subscribe(observer);
    }
    UpdateGovernorate() {
      this.showLoader = true;
      const allErrors: string[] = [];
      if (this.governorateForm.value.arName == "" || this.governorateForm.value.arName == null) {
        allErrors.push('يجب ادخال اسم المحافظه بالعربية');
      }
      if (this.governorateForm.value.enName == "" || this.governorateForm.value.enName == null) {
        allErrors.push("Governorate Name in English is required.");
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
        const Model: IAddGovernorateDto = {
          arName: this.governorateForm.value.arName,
          enName: this.governorateForm.value.enName,
        };
        const observer = {
          next: (res: any) => {
            const button = document.getElementById('btnCancel');
            if (button) {
              button.click();
            }
            this.onReset();
            this.GetGovernorates(1);
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
        this.sectorsAndActivitiesServices.UpdateGovernorate(this.id, Model).subscribe(observer);
      }
    }
}
