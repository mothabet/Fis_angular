import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddCompanyMessage, ICompanyMessage } from '../../Dtos/CompanyMessageDto';
import { HomeCompanyMessagesService } from '../../Services/home-company-messages.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { IMessage } from 'src/app/messages/Dtos/MessageDto';
import { HomemessagesService } from 'src/app/messages/services/homemessages.service';

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
  constructor(
    private formBuilder: FormBuilder,
    private companyMessageService: HomeCompanyMessagesService,
    private sharedService: SharedService,
    private activeRouter: ActivatedRoute,
    private messageService: HomemessagesService,
  ) { }
  ngOnInit(): void {
    this.companyMessageForm = this.formBuilder.group({
      companyid: '',
      messageid: ['', Validators.required],
      arDetails: '',
    });
    this.GetAllCompanyMessages(1);
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.GetAllMessages(0, '');
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
    this.companyMessageService.GetAllCompanyMessages(page, textSearch).subscribe(observer);
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
  getDateOnly(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toISOString().split('T')[0];
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
