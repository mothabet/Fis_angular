import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddCompanyMessage, ICompanyMessage } from '../../Dtos/CompanyMessageDto';
import { HomeCompanyMessagesService } from '../../Services/home-company-messages.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { IMessage } from 'src/app/messages/Dtos/MessageDto';
import { HomemessagesService } from 'src/app/messages/services/homemessages.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IGetPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';
import { PermissionsService } from 'src/app/permissions/services/permissions.service';

@Component({
  selector: 'app-home-company-messages',
  templateUrl: './home-company-messages.component.html',
  styleUrls: ['./home-company-messages.component.css']
})
export class HomeCompanyMessagesComponent {
  companyMessageForm!: FormGroup;
  showLoader: boolean = false;
  companyMessages: ICompanyMessage[] = [];
  companyMessage!: ICompanyMessage;
  addcompanyMessage!: IAddCompanyMessage;
  noData: boolean = false;
  add: boolean = true;
  id: number = 0;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  searchText: string = '';
  companyId!: string;
  messages: IMessage[] = [];
  selectedMessage: IMessage = {
    arDetails: '',
    arName: '',
    arSubject: '',
    CreatedOn: '',
    enDetails: '',
    enName: '',
    enSubject: '',
    Id: 0,
    typeMessage: 0
  };
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
    connectWithCompany:true,
    addCompaniesGroup:true, 
    AddFormNotes:true,
    copy:true,
    Instructions:true,
    FormNotes: true, 
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionCopmanyMessages: IGetPermissionDto = {
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
    AddFormNotes:true,
    copy:true,
    Instructions:true,
    FormNotes: true, 
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionCopmanyGeneralInformation: IGetPermissionDto = {
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
  permissionForms: IGetPermissionDto = {
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
  constructor(
    private formBuilder: FormBuilder,
    private companyMessageService: HomeCompanyMessagesService,
    private sharedService: SharedService,
    private activeRouter: ActivatedRoute,
    private messageService: HomemessagesService,
    private sanitizer: DomSanitizer,
    private permissionsService: PermissionsService
  ) { }
  ngOnInit(): void {
    this.companyMessageForm = this.formBuilder.group({
      companyid: '',
      messageid: ['', Validators.required],
      arDetails: '',
    });
    
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.GetAllCompanyMessages(1);
    this.GetAllMessages(0, '');
    this.GetPermissionByUserId();
    this.GetPermissionByUserIdForms();
    this.GetPermissionByUserIdCopmanyMessages();
    this.GetPermissionByUserIdCopmanyGeneralInformation();
  }
  GetPermissionByUserId() {
    this.permissionsService.FunctionGetPermissionByUserId("Companies-Details").then(permissions => {
      this.permission = permissions;
    });
  }
  GetPermissionByUserIdForms() {
    this.permissionsService.FunctionGetPermissionByUserId("CompanyHome").then(permissions => {
      this.permissionForms = permissions;
    });
  }
  GetPermissionByUserIdCopmanyMessages() {
    this.permissionsService.FunctionGetPermissionByUserId("CopmanyMessages").then(permissions => {
      this.permissionCopmanyMessages = permissions;
    });
  }
  GetPermissionByUserIdCopmanyGeneralInformation() {
    this.permissionsService.FunctionGetPermissionByUserId("CopmanyGeneralInformation").then(permissions => {
      this.permissionCopmanyGeneralInformation = permissions;
    });
  }
  updateMessage(event: Event) {
    const target = event.target as HTMLElement; // Cast to HTMLElement
    this.selectedMessage.arDetails = target.innerHTML; // Access innerHTML safely
}

get sanitizedContent() {
    return this.sanitizer.bypassSecurityTrustHtml(this.selectedMessage.arDetails);
}
  AddCompanyMessage(): void {
    this.showLoader = true;
    if (this.companyMessageForm.valid) {
      const Model: IAddCompanyMessage = {
        companyid: Number(this.companyId),
        messageid: this.companyMessageForm.value.messageid,
      };
      const observer = {
        next: (res: any) => {
          
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllCompanyMessages(1);
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
      this.companyMessageService.AddCompanyMessage(Model).subscribe(observer);
    } else {
      const allErrors: string[] = [];
      for (const controlName in this.companyMessageForm.controls) {
        if (this.companyMessageForm.controls[controlName].invalid) {
          const errors = this.getControlErrors(controlName);
          allErrors.push(...errors);
        }
      }
      Swal.fire({
        icon: 'error',
        title: allErrors.join('<br>'),
        showConfirmButton: false,
        timer: 2000,
      });
      this.showLoader = false;
    }
  }
  resetForm(): void {
    this.companyMessageForm.reset({
      companyid: Number(this.companyId),
      messageid: '',
      date: '',
      time: '',
      arDetails: ''
    });
    this.selectedMessage.arDetails = "";
  }
  GetAllCompanyMessages(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.companyMessages = res.Data.getCompanyMessagesDtos;
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.resetForm();
        }
        else {
          this.companyMessages = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.companyMessageService.GetAllCompanyMessages(page,+this.companyId, textSearch).subscribe(observer);
  }
  getDateOnly(dateTimeString: Date): string {
    if(dateTimeString!=null && dateTimeString.toString() != ""){
      const date = new Date(dateTimeString.toString());
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // إضافة صفر في حالة كان الشهر أقل من 10
      const day = ('0' + date.getDate()).slice(-2); // إضافة صفر في حالة كان اليوم أقل من 10
      return `${year}-${month}-${day}`;
    }
    else
      return ""
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
        this.DeleteCompanyMessage(id);
      }
    });
  }
  DeleteCompanyMessage(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllCompanyMessages(1);
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
    this.companyMessageService.DeleteCompanyMessage(id).subscribe(observer);
  }
  editMessage(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.companyMessage = res.Data;
          // const formattedDate = this.companyMessage.date
          // ? new Date(this.companyMessage.date).toISOString().split('T')[0]
          // : '';
          this.companyMessageForm.patchValue({
            companyid: Number(this.companyId),
            messageid: this.companyMessage.messageid,
            // date: formattedDate,
            // time: this.companyMessage.time,
          });
          if (this.selectedMessage) {
            this.selectedMessage.arDetails = this.companyMessage.arDetails;
          } this.showLoader = false;
          this.add = false;
          const button = document.getElementById('addCompanyMessageBtn');
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
    this.companyMessageService.GetCompanyMessageId(id).subscribe(observer);
  }
  UpdateCompanyMessage() {
    this.showLoader = true;
    if (this.companyMessageForm.valid) {
      const Model: IAddCompanyMessage = {
        companyid: Number(this.companyId),
        messageid: this.companyMessageForm.value.messageid,
        // date: this.companyMessageForm.value.date,
        // time: this.companyMessageForm.value.time,
      };
      const observer = {
        next: (res: any) => {
          
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllCompanyMessages(1);
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
      this.companyMessageService.UpdateCompanyMessage(this.id, Model).subscribe(observer);
    } else {
      const allErrors: string[] = [];
      for (const controlName in this.companyMessageForm.controls) {
        if (this.companyMessageForm.controls[controlName].invalid) {
          const errors = this.getControlErrors(controlName);
          allErrors.push(...errors);
        }
      }
      Swal.fire({
        icon: 'error',
        title: allErrors.join('<br>'),
        showConfirmButton: false,
        timer: 2000,
      });
      this.showLoader = false;
    }
  }
  getControlErrors(controlName: string): string[] {
    const control = this.companyMessageForm.get(controlName);
    const errors: string[] = [];
    if (control && control.errors) {
      if (controlName == 'messageid') controlName = 'المراسلة';
      if (controlName == 'date') controlName = 'التاريخ';
      if (controlName == 'time') controlName = 'الوقت';
      if (controlName == 'المراسلة'&&control.errors['required']) {
        errors.push(`يجب اختيار ${controlName}`);
      }
      else if (control.errors['required']) {
        errors.push(`يجب ادخال ${controlName}`);
      }
    }
    return errors;
  }
  
  researcherSearch() {
    this.GetAllCompanyMessages(this.currentPage, this.searchText);
  }
  GetAllMessages(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.messages = [];
          res.Data.getMessagesDtos.forEach((message: IMessage) => {
            switch (message.typeMessage) {
              case 1:
                this.messages.push(message);
                break;
              case 2:
                this.messages.push(message);
                break;
            }
          });
        }
        else {
          this.messages = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.messageService.GetAllMessages(page, textSearch).subscribe(observer);
  }
  onSelectMessage(event: any): void {
    
    const selectedMessageId = event.target.value;
    const foundMessage = this.messages.find(message => message.Id == selectedMessageId);
    if (foundMessage) {
      this.selectedMessage = foundMessage;
    } else {
      // Handle the case when no message is found, e.g., show an error message or assign a default value
      this.selectedMessage = {
        arDetails: '',
        arName: '',
        arSubject: '',
        CreatedOn: '',
        enDetails: '',
        enName: '',
        enSubject: '',
        Id: 0,
        typeMessage: 0
      };
    }

  }
  onPageChange(page: number) {
    
    this.currentPage = page;
    this.GetAllCompanyMessages(page);
  }
}
