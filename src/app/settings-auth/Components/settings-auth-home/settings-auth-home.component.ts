import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SettingsAuthService } from '../../Services/settings-auth.service';
import Swal from 'sweetalert2';
import { IAddSettingsAuth, IAddSettingsAuthAndPermissionDto, IGetSettingsAuthDto } from '../../Dtos/SettingsAuthHomeDto';
import { IAddPermissionDto, IGetPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';
import { PermissionsService } from 'src/app/permissions/services/permissions.service';

@Component({
  selector: 'app-settings-auth-home',
  templateUrl: './settings-auth-home.component.html',
  styleUrls: ['./settings-auth-home.component.css']
})
export class SettingsAuthHomeComponent {
  showLoader: boolean = false;
  settingsAuthForm!: FormGroup;
  phoneCode: number = 968;
  add: boolean = true;
  addPermissionDtoList: IAddPermissionDto[] = [];
  getSettingsAuthDto: IGetSettingsAuthDto[] = [];
  settingsAuthDto: IGetSettingsAuthDto = {
    arName: "",
    email: "",
    enName: "",
    id: 0,
    password: "",
    permissions: [],
    phone: "",
    status: "",
    UserId: 0,
    userName: ""
  };
  noData: boolean = false;
  id: number = 0;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
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
  staticPermissions = [
    { arName: 'الباحثين او المشرف', enName: "Researcher", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'عرض تفاصيل الباحث', enName: "Researcher-Details", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'الشركات', enName: "Companies", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'عرض تفاصيل الشركة', enName: "Companies-Details", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'الاستمارات الحالية للشركة', enName: "CompanyHome", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'المراسلات', enName: "CopmanyMessages", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'المعنيين', enName: "CopmanyGeneralInformation", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    // { arName: 'التقارير', enName: "Reports", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'تصميم الاستمارات', enName: "Forms", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'عرض الاستمارة', enName: "FormDetails", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'إضافة جدول', enName: "Table", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'إضافة سؤال', enName: "Question", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'قواعد التدقيق', enName: "Auditing-Rules", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'محتوي الاستماره', enName: "Codes", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'الرسائل والايميلات والاشعارات', enName: "Messages", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'الصلاحيات', enName: "SettingsAuth", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'القطاعات', enName: "Sectors", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'القسم', enName: "Sections", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'المجموعات', enName: "Groups", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'الفئات', enName: "Categories", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'الأنشطة', enName: "Activities", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'الدول', enName: "Countries", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'المحافظات', enName: "Governorates", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
    { arName: 'الولايات', enName: "Countries", isName: true, add: true, edit: true, delete: true, download: true, connectWithCompany: true, addCompaniesGroup: true, copy: true, Instructions: true, FormNotes: true, AddFormNotes: true, Approve: true, Complete: true, Close: true, Open: true },
  ];
  searchTerm: string = '';
filteredPermissions: any[] = [];
filteredStaticPermissions: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private settingsAuthService: SettingsAuthService,
    private sharedService: SharedService,
    private permissionsService: PermissionsService
  ) { }
  ngOnInit(): void {
    this.filteredStaticPermissions = this.staticPermissions;
    console.log(this.filteredPermissions)
    this.initializeForm();
    this.GetAllSettingsAuths(1, '');
    this.generateRandomCredentials();
    this.GetPermissionByUserId();
    // Listen for changes in each isName checkbox

  }
  
  GetPermissionByUserId() {
    this.permissionsService.FunctionGetPermissionByUserId("SettingsAuth").then(permissions => {
      this.permission = permissions;
    });
  }
  ngAfterViewInit() {
    // After the view is initialized, loop through the permissions and set up the subscriptions
    this.permissions.controls.forEach((group, index) => {
      group.get('isName')?.valueChanges.subscribe((isChecked: boolean) => {
        group.patchValue(
          {
            add: isChecked,
            edit: isChecked,
            delete: isChecked,
            download: isChecked,
            connectWithCompany: isChecked,
            addCompaniesGroup: isChecked,
            copy: isChecked,
            Instructions: isChecked,
            FormNotes: isChecked,
            AddFormNotes: isChecked,
            Approve: isChecked,
            Complete: isChecked,
            Close: isChecked,
            Open: isChecked
          },
          { emitEvent: false } // Prevents recursion from re-triggering value changes
        );
      });
    });
  }
  private initializeForm(): void {
    const permissionsFormGroups = this.staticPermissions.map(permission =>
      this.formBuilder.group({
        arName: [permission.arName, Validators.required],
        enName: [permission.enName, Validators.required],
        isName: [true],
        add: [true],
        edit: [true],
        delete: [true],
        download: [true],
        connectWithCompany: [true],
        addCompaniesGroup: [true],
        copy: [true],
        Instructions: [true],
        FormNotes: [true],
        AddFormNotes: [true],
        Approve: [true],
        Complete: [true],
        Close: [true],
        Open: [true]
      })
    );

    this.settingsAuthForm = this.formBuilder.group({
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
      permissions: this.formBuilder.array(permissionsFormGroups),
    });
    this.filteredPermissions = this.permissions.controls;
  }
  filterPermissions() {
     
    this.staticPermissions = this.filteredStaticPermissions.filter(permission => 
      permission.arName.includes(this.searchTerm)
    );
  }
  
  get permissions(): FormArray {
    return this.settingsAuthForm.get('permissions') as FormArray;
  }

  generateRandomCredentials(): void {
    this.showLoader = true;
    this.GetSettingsAuthCode();
    this.settingsAuthForm.patchValue({
      password: this.sharedService.generateRandomString(12) // Generate a 12 character password
    });
    this.showLoader = false;
  }
  GetSettingsAuthCode(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.settingsAuthForm.patchValue({
            userName: `FIS_U0${res.Data}`
          });
          this.showLoader = false;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.settingsAuthService.GetSettingsAuthCode().subscribe(observer);
  }
  onlyNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }
  AddSettingsAuth(): void {
    this.showLoader = true;
    
    if (this.settingsAuthForm.valid) {
      this.addPermissionDtoList = [];
      for (let index = 0; index < this.settingsAuthForm.value.permissions.length; index++) {
        

        const permission: IAddPermissionDto = {
          add: this.settingsAuthForm.value.permissions[index].add,
          arName: this.settingsAuthForm.value.permissions[index].arName,
          delete: this.settingsAuthForm.value.permissions[index].delete,
          connectWithCompany: this.settingsAuthForm.value.permissions[index].connectWithCompany,
          addCompaniesGroup: this.settingsAuthForm.value.permissions[index].addCompaniesGroup,
          download: this.settingsAuthForm.value.permissions[index].download,
          edit: this.settingsAuthForm.value.permissions[index].edit,
          enName: this.settingsAuthForm.value.permissions[index].enName,
          isName: this.settingsAuthForm.value.permissions[index].isName,
          copy: this.settingsAuthForm.value.permissions[index].copy,
          Instructions: this.settingsAuthForm.value.permissions[index].Instructions,
          AddFormNotes: this.settingsAuthForm.value.permissions[index].AddFormNotes,
          FormNotes: this.settingsAuthForm.value.permissions[index].FormNotes,
          Approve: this.settingsAuthForm.value.permissions[index].Approve,
          Complete: this.settingsAuthForm.value.permissions[index].Complete,
          Close: this.settingsAuthForm.value.permissions[index].Close,
          Open: this.settingsAuthForm.value.permissions[index].Open
        }
        this.addPermissionDtoList.push(permission);
      }
      const addSettingAuth: IAddSettingsAuth = {
        userName: this.settingsAuthForm.value.userName,
        password: this.settingsAuthForm.value.password,
        arName: this.settingsAuthForm.value.arName,
        enName: this.settingsAuthForm.value.enName,
        status: this.settingsAuthForm.value.status,
        phone: this.phoneCode + this.settingsAuthForm.value.phone,
        email: this.settingsAuthForm.value.email,
      };
      const Model: IAddSettingsAuthAndPermissionDto = {
        addPermissionDto: this.addPermissionDtoList,
        addSettingsAuthDto: addSettingAuth
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllSettingsAuths(1);
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
      this.settingsAuthService.AddSettingsAuth(Model).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
  GetAllSettingsAuths(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    
    const observer = {
      next: (res: any) => {

        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.getSettingsAuthDto = res.Data.getSettingsAuthDtos;
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
        }
        else {
          this.getSettingsAuthDto = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.settingsAuthService.GetAllSettingsAuths(page, textSearch).subscribe(observer);
  }
  resetForm(): void {
    const permissionsFormGroups = this.staticPermissions.map(permission =>
      this.formBuilder.group({
        arName: [permission.arName, Validators.required],
        enName: [permission.enName, Validators.required],
        isName: [true],
        add: [true],
        edit: [true],
        delete: [true],
        download: [true],
        connectWithCompany: [true],
        addCompaniesGroup: [true],
        copy: [true],
        Instructions: [true],
        FormNotes: [true],
        AddFormNotes: [true],
        Approve: [true],
        Complete: [true],
        Close: [true],
        Open: [true]
      })
    );

    this.settingsAuthForm = this.formBuilder.group({
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
      permissions: this.formBuilder.array(permissionsFormGroups),
    });
    
    this.filteredPermissions = this.permissions.controls;
    // Additional actions
    this.add = true;
    this.generateRandomCredentials();
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
        this.DeleteSettingsAuth(id);
      }
    });
  }

  DeleteSettingsAuth(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllSettingsAuths(1);
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
    this.settingsAuthService.DeleteSettingsAuth(id).subscribe(observer);
  }
  GetSettingsAuthById(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        
        if (res.Data) {
          
          this.settingsAuthDto = res.Data;
          this.settingsAuthDto.phone = this.settingsAuthDto.phone.replace(this.phoneCode.toString(), '');
          if (res.Data.researcherId > 0 && !(this.settingsAuthDto.permissions.length>0)) {
            this.staticPermissions.forEach(permission=>{
              const permissionAdd: IGetPermissionDto = {
                add: false,
                addCompaniesGroup: false,
                AddFormNotes: false,
                Approve: false,
                arName: permission.arName,
                Close: false,
                Complete: false,
                connectWithCompany: false,
                copy: false,
                delete: false,
                download: false,
                edit: false,
                enName: permission.enName,
                FormNotes: false,
                id: 0,
                Instructions: false,
                isName: false,
                Open: false,
                settingsAuthId: this.settingsAuthDto.id
              }
              this.settingsAuthDto.permissions.push(permissionAdd);
            })
          }
          
          // Create the FormArray for permissions
          const permissionsFormGroups = this.settingsAuthDto.permissions.map(permission => {
            const group = this.formBuilder.group({
              arName: [permission.arName, Validators.required],
              enName: [permission.enName, Validators.required],
              isName: [permission.isName],
              add: [permission.add],
              edit: [permission.edit],
              delete: [permission.delete],
              connectWithCompany: [permission.connectWithCompany],
              addCompaniesGroup: [permission.addCompaniesGroup],
              AddFormNotes: [permission.AddFormNotes],
              copy: [permission.copy],
              download: [permission.download],
              Instructions: [permission.Instructions],
              FormNotes: [permission.FormNotes],
              Approve: [permission.Approve],
              Complete: [permission.Complete],
              Close: [permission.Close],
              Open: [permission.Open],
            });

            // Subscribe to isName value changes to toggle other checkboxes
            group.get('isName')?.valueChanges.subscribe((isChecked: boolean | null) => {
              group.patchValue(
                {
                  add: isChecked,
                  edit: isChecked,
                  delete: isChecked,
                  connectWithCompany: isChecked,
                  addCompaniesGroup: isChecked,
                  copy: isChecked,
                  download: isChecked,
                  Instructions: isChecked,
                  FormNotes: isChecked,
                  AddFormNotes: isChecked,
                  Approve: isChecked,
                  Complete: isChecked,
                  Close: isChecked,
                  Open: isChecked
                },
                { emitEvent: false } // Prevents recursion from re-triggering value changes
              );
            });

            return group;
          });


          // Clear existing FormArray items before repopulating
          const permissionsArray = this.settingsAuthForm.get('permissions') as FormArray;
          permissionsArray.clear();
          permissionsFormGroups.forEach(group => permissionsArray.push(group));

          // Patch the rest of the form fields
          this.settingsAuthForm.patchValue({
            userName: this.settingsAuthDto.userName,
            password: this.settingsAuthDto.password,
            arName: this.settingsAuthDto.arName,
            enName: this.settingsAuthDto.enName,
            status: this.settingsAuthDto.status,
            phone: this.settingsAuthDto.phone,
            email: this.settingsAuthDto.email,
          });
          if (!(res.Data.researcherId > 0 && !(this.settingsAuthDto.permissions.length>0))) {
            this.staticPermissions = this.settingsAuthDto.permissions;
          }
          this.showLoader = false;
          this.add = false;
          const button = document.getElementById('addAuthModalBtn');
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
    this.settingsAuthService.GetSettingsAuthById(id).subscribe(observer);
  }
  UpdateSettingsAuth(): void {
    
    this.showLoader = true;
    if (this.settingsAuthForm.valid) {
      this.addPermissionDtoList = [];
      for (let index = 0; index < this.settingsAuthForm.value.permissions.length; index++) {

        const permission: IAddPermissionDto = {
          add: this.settingsAuthForm.value.permissions[index].add,
          arName: this.settingsAuthForm.value.permissions[index].arName,
          delete: this.settingsAuthForm.value.permissions[index].delete,
          connectWithCompany: this.settingsAuthForm.value.permissions[index].connectWithCompany,
          addCompaniesGroup: this.settingsAuthForm.value.permissions[index].addCompaniesGroup,
          copy: this.settingsAuthForm.value.permissions[index].copy,
          Instructions: this.settingsAuthForm.value.permissions[index].Instructions,
          FormNotes: this.settingsAuthForm.value.permissions[index].FormNotes,
          AddFormNotes: this.settingsAuthForm.value.permissions[index].AddFormNotes,
          Approve: this.settingsAuthForm.value.permissions[index].Approve,
          Complete: this.settingsAuthForm.value.permissions[index].Complete,
          Close: this.settingsAuthForm.value.permissions[index].Close,
          Open: this.settingsAuthForm.value.permissions[index].Open,
          download: this.settingsAuthForm.value.permissions[index].download,
          edit: this.settingsAuthForm.value.permissions[index].edit,
          enName: this.settingsAuthForm.value.permissions[index].enName,
          isName: this.settingsAuthForm.value.permissions[index].isName
        }
        this.addPermissionDtoList.push(permission);
      }
    

      const addSettingAuth: IAddSettingsAuth = {
        userName: this.settingsAuthForm.value.userName,
        password: this.settingsAuthForm.value.password,
        arName: this.settingsAuthForm.value.arName,
        enName: this.settingsAuthForm.value.enName,
        status: this.settingsAuthForm.value.status,
        phone: this.phoneCode + this.settingsAuthForm.value.phone,
        email: this.settingsAuthForm.value.email,
      };
      const Model: IAddSettingsAuthAndPermissionDto = {
        addPermissionDto: this.addPermissionDtoList,
        addSettingsAuthDto: addSettingAuth
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllSettingsAuths(1);
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
      this.settingsAuthService.UpdateSettingsAuth(this.id, Model).subscribe(observer);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
  isAddPermission(enName: string): boolean {
    const enNamePermission = [
      'Researcher',
      'Companies',
      'Reports',
      'Forms',
      'FormDetails',
      'Table',
      'Question',
      'Auditing-Rules',
      'Codes',
      'Messages',
      'SettingsAuth',
      'CopmanyMessages',
      'CopmanyGeneralInformation',
      'Sectors',
      'Sections',
      'Groups',
      'Categories',
      'Activities',
      'Countries',
      'Governorates',
      'Wilayat'
    ];
    return enNamePermission.includes(enName);
  }
  isEditPermission(enName: string): boolean {
    const enNamePermission = [
      'Researcher',
      'Companies',
      'Reports',
      'Forms',
      'Table',
      'Question',
      'Auditing-Rules',
      'Codes',
      'Messages',
      'SettingsAuth',
      'Sectors',
      'CopmanyGeneralInformation',
      'Sections',
      'Groups',
      'Categories',
      'Activities',
      'Countries',
      'Governorates',
      'Wilayat'
    ];
    return enNamePermission.includes(enName);
  }
  isDeletePermission(enName: string): boolean {
    const enNamePermission = [
      'Researcher',
      'Companies',
      'Reports',
      'Forms',
      'Table',
      'Question',
      'Auditing-Rules',
      'Codes',
      'Messages',
      'SettingsAuth',
      'CopmanyGeneralInformation',
      'Sectors',
      'Sections',
      'Groups',
      'Categories',
      'Activities',
      'Countries',
      'Governorates',
      'Wilayat'
    ];
    return enNamePermission.includes(enName);
  }
  isDownloadPermission(enName: string): boolean {
    const enNamePermission = [
      'Researcher',
      'Companies',
      'Reports',
      'Auditing-Rules',
      'Codes',
      'Researcher-Details',
      'Companies-Details'
    ];
    return enNamePermission.includes(enName);
  }
  isConnectWithCompanyPermission(enName: string): boolean {
    const enNamePermission = [
      'Researcher',
    ];
    return enNamePermission.includes(enName);
  }
  isAddCompaniesGroupPermission(enName: string): boolean {
    const enNamePermission = [
      'Companies',
    ];
    return enNamePermission.includes(enName);
  }
  isCopyPermission(enName: string): boolean {
    const enNamePermission = [
      'Forms',
    ];
    return enNamePermission.includes(enName);
  }
  isInstructionsPermission(enName: string): boolean {
    const enNamePermission = [
      'Forms',
      'FormDetails'
    ];
    return enNamePermission.includes(enName);
  }
  isButtonFormPermission(enName: string): boolean {
    const enNamePermission = [
      'FormDetails',
    ];
    return enNamePermission.includes(enName);
  }
}
