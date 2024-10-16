import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SettingsAuthService } from '../../Services/settings-auth.service';
import Swal from 'sweetalert2';
import { IAddPermissionDto, IAddSettingsAuth, IAddSettingsAuthAndPermissionDto } from '../../Dtos/SettingsAuthHomeDto';

@Component({
  selector: 'app-settings-auth-home',
  templateUrl: './settings-auth-home.component.html',
  styleUrls: ['./settings-auth-home.component.css']
})
export class SettingsAuthHomeComponent {
  showLoader: boolean = false;
  authForm!: FormGroup;
  phoneCode: number = 968;
  add:boolean = true;
  addPermissionDtoList : IAddPermissionDto[] = []
  constructor(
    private formBuilder: FormBuilder,
    private settingsAuthService : SettingsAuthService,
    private sharedService: SharedService,
  ) { }
  ngOnInit(): void {
    this.authForm = this.formBuilder.group({
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
      permissions: this.formBuilder.array([])  // Initialize the FormArray for permissions
    });
  
    // Add static permissions
    this.addStaticPermissions();
  
    this.generateRandomCredentials();
  }
  
  get permissions(): FormArray {
    return this.authForm.get('permissions') as FormArray;
  }
  addStaticPermissions() {
    const staticPermissions = [
      { arName: 'قواعد التدقيق',enName:"Auditing Rules", isName: true, add: false, edit: false, delete: false, download: false },
    ];
  
    staticPermissions.forEach(permission => {
      this.permissions.push(this.formBuilder.group({
        arName: [permission.arName, Validators.required],
        enName: [permission.enName, Validators.required],
        isName: [permission.isName],
        add: [permission.add],
        edit: [permission.edit],
        delete: [permission.delete],
        download: [permission.download]
      }));
    });
  }
  
  generateRandomCredentials(): void {
    this.showLoader = true;
    this.GetSettingsAuthCode();
    this.authForm.patchValue({
      password: this.sharedService.generateRandomString(12) // Generate a 12 character password
    });
    this.showLoader = false;
  }
  GetSettingsAuthCode(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.authForm.patchValue({
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
    debugger
    this.showLoader = true;
    if (this.authForm.valid) {
      this.addPermissionDtoList = [];
      for (let index = 0; index < this.authForm.value.permissions.length; index++) {
        debugger
        const permission : IAddPermissionDto = {
          add : this.authForm.value.permissions[index].add,
          arName : this.authForm.value.permissions[index].arName,
          delete : this.authForm.value.permissions[index].delete,
          download : this.authForm.value.permissions[index].download,
          edit : this.authForm.value.permissions[index].edit,
          enName : this.authForm.value.permissions[index].enName,
          isName : this.authForm.value.permissions[index].isName
        }
        this.addPermissionDtoList.push(permission);
      }
      const addSettingAuth: IAddSettingsAuth = {
        userName: this.authForm.value.userName,
        password: this.authForm.value.password,
        arName: this.authForm.value.arName,
        enName: this.authForm.value.enName,
        status: this.authForm.value.status,
        phone: this.phoneCode + this.authForm.value.phone,
        email: this.authForm.value.email,
      };
      const Model : IAddSettingsAuthAndPermissionDto  = {
        addPermissionDto: this.addPermissionDtoList,
        addSettingsAuthDto : addSettingAuth
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          // this.GetAllReseachers(1);
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
        icon: 'success',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
  resetForm(): void {
    this.authForm.reset({
      userName: '',
      password: '',
      arName: '',
      enName: '',
      status: '', // Default value for status after reset
      phone: '',
      email: ''
    });
    this.generateRandomCredentials();
  }
}
