import { Component, ElementRef, ViewChild } from '@angular/core';
import { ResearcherHomeService } from '../../services/researcher-home.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddResearcher, IResearcher } from '../../Dtos/ResearcherHomeDto';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-researcher-home',
  templateUrl: './researcher-home.component.html',
  styleUrls: ['./researcher-home.component.css']
})
export class ResearcherHomeComponent {
  @ViewChild('addResearcher') addResearcherModal!: ElementRef;
  researcherForm!: FormGroup;
  isDisabled: boolean = true;
  username: string = '';
  password: string = '';
  researcherCode: number = 0;
  researchers: IResearcher[] = [];
  researcher!: IAddResearcher;
  showLoader: boolean = false;
  noData: boolean = false;
  add: boolean = true;
  id:number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private researcherService: ResearcherHomeService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.researcherForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      fullName: ['', Validators.required],
      enfullName: ['', Validators.required],
      status: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.generateRandomCredentials();
    this.GetAllReseachers();
  }

  generateRandomCredentials(): void {
    this.showLoader = true;
    this.GetResearcherCode();
    this.researcherForm.patchValue({
      password: this.sharedService.generateRandomString(12) // Generate a 12 character password
    });
    this.showLoader = false;
  }

  saveResearcher(): void {
    this.showLoader = true;
    if (this.researcherForm.valid) {
      const Model: IAddResearcher = {
        userName: this.researcherForm.value.userName,
        password: this.researcherForm.value.password,
        fullName: this.researcherForm.value.fullName,
        enfullName: this.researcherForm.value.enfullName,
        status: this.researcherForm.value.status,
        phone: this.researcherForm.value.phone,
        email: this.researcherForm.value.email,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllReseachers();
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
      this.researcherService.addResearcher(Model).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }

  GetResearcherCode(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.researcherForm.patchValue({
            userName: `FIS_R0${res.Data}`
          });
          this.showLoader = false;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherService.GetResearcherCode().subscribe(observer);
  }

  resetForm(): void {
    this.researcherForm.reset({
      userName: '',
      password: '',
      fullName: '',
      enfullName: '',
      status: '', // Default value for status after reset
      phone: '',
      email: ''
    });
    this.generateRandomCredentials();
  }

  GetAllReseachers(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.researchers = res.Data;
        this.showLoader = false;
        this.noData = !res.Data || res.Data.length === 0;
        this.resetForm();
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherService.GetAllReseachers().subscribe(observer);
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
        this.DeleteReseacher(id);
      }
    });
  }

  DeleteReseacher(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllReseachers();
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
    this.researcherService.DeleteReseacher(id).subscribe(observer);
  }

  editResearcher(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
        if (res.Data) {
          this.researcher = res.Data;
          this.researcherForm.patchValue({
            userName: this.researcher.userName,
            password: this.researcher.password,
            fullName: this.researcher.fullName,
            enfullName: this.researcher.enfullName,
            status: this.researcher.status,
            phone: this.researcher.phone,
            email: this.researcher.email
          });
          this.showLoader = false;
          this.add = false;
          const button = document.getElementById('addResearcherBtn');
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
    this.researcherService.GetResearcherById(id).subscribe(observer);
  }
  updateResearcher() {
    this.showLoader = true;
    if (this.researcherForm.valid) {
      const Model: IAddResearcher = {
        userName: this.researcherForm.value.userName,
        password: this.researcherForm.value.password,
        fullName: this.researcherForm.value.fullName,
        enfullName: this.researcherForm.value.enfullName,
        status: this.researcherForm.value.status,
        phone: this.researcherForm.value.phone,
        email: this.researcherForm.value.email,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllReseachers();
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
      this.researcherService.updateResearcher(this.id,Model).subscribe(observer);
    } else {
      this.toastr.error('يجب ادخال البيانات بشكل صحيح');
      this.showLoader = false;
    }
  }
  reset(){
    this.add = true;
    this.researcherForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      fullName: ['', Validators.required],
      enfullName: ['', Validators.required],
      status: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
    });
    this.generateRandomCredentials();
  }
}
