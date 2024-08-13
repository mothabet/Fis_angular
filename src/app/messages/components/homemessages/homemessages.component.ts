import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import { HomemessagesService } from '../../services/homemessages.service';
import { IAddMessage, IMessage } from '../../Dtos/MessageDto';
import Swal from 'sweetalert2';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-homemessages',
  templateUrl: './homemessages.component.html',
  styleUrls: ['./homemessages.component.css']
})
export class HomemessagesComponent implements OnInit,OnDestroy {
  messageForm!: FormGroup;
  showLoader: boolean = false;
  messages: IMessage[] = [];
  emails: IMessage[] = [];
  notifications: IMessage[] = [];
  message!: IMessage;
  addMessage!: IAddMessage;
  noData: boolean = false;
  add: boolean = true;
  id: number = 0;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  buttonText: string = 'إنشاء رسالة';
  typeMessage: number = 1;
  searchText: string = '';
  editor!: Editor;
  editoren!: Editor;
  emailEn = '';
  emailAr = '';
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private messageService: HomemessagesService,
    private sharedService: SharedService,
  ) { }
  ngOnDestroy(): void {
    this.editor.destroy();
    this.editoren.destroy();
  }
  ngOnInit(): void {
    this.messageForm = this.formBuilder.group({
      arDetails: ['', Validators.required],
      enDetails: ['', Validators.required],
      arSubject: ['', Validators.required],
      enSubject: ['', Validators.required],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      typeMessage: [''],
    });
    this.GetAllMessages(1);
    this.editor = new Editor();
    this.editoren = new Editor();
  }
  AddMessage(typeMessage: number): void {
    this.showLoader = true;
    debugger
    if (this.messageForm.valid) {
      const Model: IAddMessage = {
        arDetails: this.messageForm.value.arDetails,
        enDetails: this.messageForm.value.enDetails,
        arSubject: this.messageForm.value.arSubject,
        enSubject: this.messageForm.value.enSubject,
        enName: this.messageForm.value.enName,
        arName: this.messageForm.value.arName,
        typeMessage: typeMessage,
      };
      const observer = {
        next: (res: any) => {
          debugger
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllMessages(1);
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
      this.messageService.AddMessage(Model).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }
  resetForm(): void {
    this.messageForm.reset({
      arDetails: '',
      enDetails: '',
      arSubject: '',
      enSubject: '',
      enName: '',
      arName: '',
    });
  }
  GetAllMessages(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.messages = [];
          this.emails = [];
          this.notifications = [];
          res.Data.getMessagesDtos.forEach((message: IMessage) => {
            switch (message.typeMessage) {
              case 1:
                this.messages.push(message);
                break;
              case 2:
                this.emails.push(message);
                break;
              case 3:
                this.notifications.push(message);
                break;
            }
          });
          
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.resetForm();
        }
        else {
          this.messages = [];
          this.emails = [];
          this.notifications = [];
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
        this.DeleteMessage(id);
      }
    });
  }
  DeleteMessage(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllMessages(1);
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
    this.messageService.DeleteMessage(id).subscribe(observer);
  }
  editMessage(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.message = res.Data;
          this.messageForm.patchValue({
            arDetails: this.message.arDetails,
            enDetails: this.message.enDetails,
            arName: this.message.arName,
            enName: this.message.enName,
            arSubject: this.message.arSubject,
            enSubject: this.message.enSubject,
          });
          debugger
          this.showLoader = false;
          this.add = false;
          const button = document.getElementById('addMessageBtn');
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
    this.messageService.GetMessageId(id).subscribe(observer);
  }
  UpdateMessage(typeMessage: number) {
    this.showLoader = true;
    if (this.messageForm.valid) {
      const Model: IAddMessage = {
        arDetails: this.messageForm.value.arDetails,
        enDetails: this.messageForm.value.enDetails,
        arName: this.messageForm.value.arName,
        enName: this.messageForm.value.enName,
        arSubject: this.messageForm.value.arSubject,
        enSubject: this.messageForm.value.enSubject,
        typeMessage: typeMessage,
      };
      const observer = {
        next: (res: any) => {
          debugger
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllMessages(1);
          this.showLoader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err: any) => {
          debugger
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.messageService.UpdateMessage(this.id, Model).subscribe(observer);
    } else {
      const allErrors: string[] = [];
      for (const controlName in this.messageForm.controls) {
        if (this.messageForm.controls[controlName].invalid) {
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
    const control = this.messageForm.get(controlName);
    const errors: string[] = [];

    if (control && control.errors) {

      // Check if control is not null and has errors
      if (controlName == 'arName') controlName = 'اسم الاستمارة بالعربى';
      if (controlName == 'enName') controlName = 'Form Name in English';
      if (controlName == 'arDetails') controlName = 'ملاحظات بالعربى';
      if (controlName == 'enDetails') controlName = 'Notes in English';
      if (controlName == 'arSubject') controlName = 'حالة الاستماره';
      if (controlName == 'enSubject') controlName = 'نوع الاستماره';

      if (control.errors['required']) {
        errors.push(`يجب ادخال ${controlName}`);
      }
      // Add other error types here if needed
    }

    return errors;
  }
  setButtonText(text: string, typeMessage: number): void {
    this.buttonText = text;
    this.typeMessage = typeMessage;
    
  }
  onPageChange(page: number) {
    debugger
    this.currentPage = page;
    this.GetAllMessages(page);
  }
  getTypeMessage(typeMessage: number): string {
    switch (typeMessage) {
      case 1:
        return 'رساله';
      case 2:
        return 'ايميل';
      case 3:
        return 'اشعار';
      default:
        return '';
    }
  }
  getDateOnly(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toISOString().split('T')[0];
  }
  researcherSearch() {
    this.GetAllMessages(this.currentPage, this.searchText);
  }
}
