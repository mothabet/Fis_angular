import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IGetPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';
import { SectorAndActivitiesService } from '../../Services/sector-and-activities.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { PermissionsService } from 'src/app/permissions/services/permissions.service';
import { IAddGovernorateDto, IAddWilayatDto, IGetGovernorateDto, IGetWilayatDto } from '../../Dtos/SectorDtos';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wilayat',
  templateUrl: './wilayat.component.html',
  styleUrls: ['./wilayat.component.css']
})
export class WilayatComponent {
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
    AddFormNotes: true,
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
    AddFormNotes: true,
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
    AddFormNotes: true,
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
    AddFormNotes: true,
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
    AddFormNotes: true,
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
    AddFormNotes: true,
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
  wilayatForm!: FormGroup;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  searchText: string = '';
  noData: boolean = false;
  Wilayat: IGetWilayatDto[] = [];
  getWilayat : IGetWilayatDto = {
    id:0,
    arName:'',
    enName:'',
    embeded:'',
    GovernoratesId:0,
    Governorates:{} as IGetGovernorateDto
  };
  isUpdate: boolean = false;
  id:number=0;
  governorates : IGetGovernorateDto[] = [];

  constructor(private sharedService: SharedService, private fb: FormBuilder,
    private sectorsAndActivitiesServices: SectorAndActivitiesService,
    private permissionsService: PermissionsService) { }
  ngOnInit(): void {
    this.wilayatForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      embeded: [''],
      GovernoratesId: ['', Validators.required]
    });
    this.GetWilayat(0,1, '',);
    this.GetGovernorates(0,'',);
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
    if (this.wilayatForm.value.arName == "" || this.wilayatForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم الولايه بالعربية');
    }
    if (this.wilayatForm.value.enName == "" || this.wilayatForm.value.enName == null) {
      allErrors.push("State Name in English is required.");
    }
    if (this.wilayatForm.value.GovernoratesId == "" || this.wilayatForm.value.GovernoratesId == null) {
      allErrors.push('يجب اختيار المحافظه');
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
      const wilayat: IAddWilayatDto = {
        arName: this.wilayatForm.value.arName,
        enName: this.wilayatForm.value.enName,
        embeded: '',
        GovernoratesId: this.wilayatForm.value.GovernoratesId,
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetWilayat(0,1, '');
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
      this.sectorsAndActivitiesServices.AddWilayat(wilayat).subscribe(observer);
    }
  }
  GetWilayat(governorateId:number,page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          
          this.Wilayat = res.Data.getWilayaDtos;
          this.currentPage = res.Data.PageNumber;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.onReset();
        }
        else {
          this.Wilayat = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetWilayats(governorateId,page, textSearch).subscribe(observer);
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetWilayat(0,page);
  }
  wilayatSearch() {
    this.GetWilayat(0,this.currentPage, this.searchText);
  }
  onReset(): void {
    this.isUpdate = false;
    this.wilayatForm = this.fb.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      embeded: [''],
      GovernoratesId: ['', Validators.required]
    });
  }
  DeleteWilayat(id: number): void {
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
            this.GetWilayat(0,1, '');
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
        this.sectorsAndActivitiesServices.DeleteWilayat(id).subscribe(observer);
      }
    });
  }
  openUpdatePopup(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.getWilayat = res.Data;
          this.wilayatForm.patchValue({
            arName: this.getWilayat.arName,
            enName: this.getWilayat.enName,
            embeded: this.getWilayat.enName,
            GovernoratesId: this.getWilayat.GovernoratesId,
          });
          this.id = this.getWilayat.id;
        }
        this.isUpdate = true;
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.sectorsAndActivitiesServices.GetWilayat(id).subscribe(observer);
  }
  UpdateWilayat() {
    this.showLoader = true;
    const allErrors: string[] = [];
    if (this.wilayatForm.value.arName == "" || this.wilayatForm.value.arName == null) {
      allErrors.push('يجب ادخال اسم الولايه بالعربية');
    }
    if (this.wilayatForm.value.enName == "" || this.wilayatForm.value.enName == null) {
      allErrors.push("State Name in English is required.");
    }
    if (this.wilayatForm.value.GovernoratesId == "" || this.wilayatForm.value.GovernoratesId == null) {
      allErrors.push('يجب اختيار المحافظه');
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
      const Model: IAddWilayatDto = {
        arName: this.wilayatForm.value.arName,
        enName: this.wilayatForm.value.enName,
        embeded:this.wilayatForm.value.embeded,
        GovernoratesId: this.wilayatForm.value.GovernoratesId,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.onReset();
          this.GetWilayat(0,1);
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
      this.sectorsAndActivitiesServices.UpdateWilayat(this.id, Model).subscribe(observer);
    }
  }
  GetGovernorates(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          
          this.governorates = res.Data.getGovernoratesDto;
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
}
