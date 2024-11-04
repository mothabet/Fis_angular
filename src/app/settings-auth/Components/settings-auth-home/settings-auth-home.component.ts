import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SettingsAuthService } from '../../Services/settings-auth.service';
import Swal from 'sweetalert2';
import { IAddSettingsAuth, IAddSettingsAuthAndPermissionDto, IGetSettingsAuthDto } from '../../Dtos/SettingsAuthHomeDto';
import { IAddPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';

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
  staticPermissions = [
    { arName: 'الباحثين او المشرف', enName: "Researcher", isName: true, add: true, edit: true, delete: true, download: true,connectWithCompany:true ,addCompaniesGroup:true, copy:true },
    { arName: 'الشركات', enName: "Companies", isName: true, add: true, edit: true, delete: true, download: true,connectWithCompany:true ,addCompaniesGroup:true, copy:true },
    { arName: 'التقارير', enName: "Reports", isName: true, add: true, edit: true, delete: true, download: true,connectWithCompany:true ,addCompaniesGroup:true , copy:true},
    { arName: 'تصميم الاستمارات', enName: "Forms", isName: true, add: true, edit: true, delete: true, download: true,connectWithCompany:true ,addCompaniesGroup:true , copy:true},
    { arName: 'إضافة جدول', enName: "Table", isName: true, add: true, edit: true, delete: true, download: true,connectWithCompany:true ,addCompaniesGroup:true, copy:true},
    { arName: 'إضافة سؤال', enName: "Question", isName: true, add: true, edit: true, delete: true, download: true,connectWithCompany:true ,addCompaniesGroup:true, copy:true},
    { arName: 'قواعد التدقيق', enName: "Auditing-Rules", isName: true, add: true, edit: true, delete: true, download: true,connectWithCompany:true ,addCompaniesGroup:true , copy:true},
    { arName: 'محتوي الاستماره', enName: "Codes", isName: true, add: true, edit: true, delete: true, download: true,connectWithCompany:true ,addCompaniesGroup:true , copy:true},
    { arName: 'الرسائل', enName: "Messages", isName: true, add: true, edit: true, delete: true, download: true,connectWithCompany:true ,addCompaniesGroup:true , copy:true},
    { arName: 'الصلاحيات', enName: "SettingsAuth", isName: true, add: true, edit: true, delete: true, download: true,connectWithCompany:true ,addCompaniesGroup:true , copy:true},
    { arName: 'الانشطة و القطاعات', enName: "Sectors", isName: true, add: true, edit: true, delete: true, download: true,connectWithCompany:true ,addCompaniesGroup:true , copy:true},
  ];
  constructor(
    private formBuilder: FormBuilder,
    private settingsAuthService: SettingsAuthService,
    private sharedService: SharedService,
  ) { }
  ngOnInit(): void {
    this.initializeForm();
    this.GetAllSettingsAuths(1, '');
    this.generateRandomCredentials();

    // Listen for changes in each isName checkbox

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
            connectWithCompany:isChecked,
            addCompaniesGroup:isChecked,
            copy:isChecked,
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
        connectWithCompany:[true],
        addCompaniesGroup:[true],
        copy:[true],
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
    debugger
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
    debugger
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
    this.settingsAuthForm.reset({
      userName: '',
      password: '',
      arName: '',
      enName: '',
      status: '', // Default value for status after reset
      phone: '',
      email: ''
    });

    // Reset permissions, but maintain the relationship and arName, enName
    this.permissions.controls.forEach((group) => {
      group.patchValue({
        isName: true, // Reset to false or the initial value
        add: true,
        edit: true,
        delete: true,
        download: true,
        connectWithCompany:true,
        addCompaniesGroup:true,
        copy:true,
        arName: group.get('arName')?.value, // Keep the existing value
        enName: group.get('enName')?.value, // Keep the existing value
      });
    });
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
              copy: [permission.copy],
              download: [permission.download],
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
                  copy:isChecked,
                  download: isChecked,
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
      'Table',
      'Question',
      'Auditing-Rules',
      'Codes',
      'Messages',
      'SettingsAuth',
      'Sectors',
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
      'Sectors',
    ];
    return enNamePermission.includes(enName);
  }
  isDownloadPermission(enName: string): boolean {
    const enNamePermission = [
      'Researcher',
      'Companies',
      'Reports',
      'Forms',
      'Auditing-Rules',
      'Codes',
      'Messages',
      'SettingsAuth',
      'Sectors',
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
}
