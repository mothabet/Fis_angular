import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddCompanyMessage, ICompanyMessage } from '../../Dtos/CompanyMessageDto';
import { ToastrService } from 'ngx-toastr';
import { HomeCompanyMessagesService } from '../../Services/home-company-messages.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

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
  constructor(
    private formBuilder: FormBuilder,
    private companyMessageService: HomeCompanyMessagesService,
    private sharedService: SharedService,
  ) { }
  ngOnInit(): void {
    this.companyMessageForm = this.formBuilder.group({
      companyid: ['', Validators.required],
      messageid: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
    });
    this.GetAllCompanyMessages(1);
  }
  AddCompanyMessage(): void {
    this.showLoader = true;
    debugger
    if (this.companyMessageForm.valid) {
      const Model: IAddCompanyMessage = {
        companyid: this.companyMessageForm.value.companyid,
        messageid: this.companyMessageForm.value.messageid,
        date: this.companyMessageForm.value.date,
        time: this.companyMessageForm.value.time,
      };
      const observer = {
        next: (res: any) => {
          debugger
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
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
  resetForm(): void {
    this.companyMessageForm.reset({
      companyid: '',
      messageid: '',
      date: '',
      time: '',
    });
  }
  GetAllCompanyMessages(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
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
          this.companyMessageForm.patchValue({
            companyid: this.companyMessage.companyid,
            messageid: this.companyMessage.messageid,
            date: this.companyMessage.date,
            time: this.companyMessage.time,
          });
          debugger
          this.showLoader = false;
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
        companyid: this.companyMessageForm.value.companyid,
        messageid: this.companyMessageForm.value.messageid,
        date: this.companyMessageForm.value.date,
        time: this.companyMessageForm.value.time,
      };
      const observer = {
        next: (res: any) => {
          debugger
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
          debugger
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

      // Check if control is not null and has errors
      // if (controlName == 'arName') controlName = 'اسم الاستمارة بالعربى';
      // if (controlName == 'enName') controlName = 'Form Name in English';
      // if (controlName == 'arDetails') controlName = 'ملاحظات بالعربى';
      // if (controlName == 'enDetails') controlName = 'Notes in English';
      // if (controlName == 'arSubject') controlName = 'حالة الاستماره';
      // if (controlName == 'enSubject') controlName = 'نوع الاستماره';

      if (control.errors['required']) {
        errors.push(`يجب ادخال ${controlName}`);
      }
      // Add other error types here if needed
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
}
