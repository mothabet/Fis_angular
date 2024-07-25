import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddCode, ICode } from '../../Dtos/CodeHomeDto';
import { CodeHomeService } from '../../Services/code-home.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-code-home',
  templateUrl: './code-home.component.html',
  styleUrls: ['./code-home.component.css']
})
export class CodeHomeComponent {
  @ViewChild('addCode') addCodeModal!: ElementRef;
  codeForm!: FormGroup;
  codes: ICode[] = [];
  code!: IAddCode;
  showLoader: boolean = false;
  noData: boolean = false;
  add: boolean = true;
  id: number = 0;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  constructor(
    private formBuilder: FormBuilder,
    private codeHomeService: CodeHomeService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.codeForm = this.formBuilder.group({
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      QuestionCode: [
        '',
        [
          Validators.pattern('^[0-9]*$'),
          Validators.required
        ]
      ],
    });

    this.GetAllCodes(this.currentPage);
  }
  onPageChange(page: number) {
    debugger
    this.currentPage = page;
    this.GetAllCodes(page);
  }
  saveCode(): void {
    this.showLoader = true;
    if (this.codeForm.valid) {
      const Model: IAddCode = {
        QuestionCode: this.codeForm.value.QuestionCode,
        arName: this.codeForm.value.arName,
        enName: this.codeForm.value.enName,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllCodes(1);
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
      this.codeHomeService.AddCode(Model).subscribe(observer);
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
    this.codeForm.reset({
      QuestionCode: '',
      arName: '',
      enName: '',
    });
  }
  GetAllCodes(page: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
        this.noData = !res.Data || res.Data.length === 0;
        if(res.Data){
          this.codes = res.Data.getCodeDtos;
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.resetForm();
        }
        else{
          this.codes=[];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.codeHomeService.GetAllCodes(page).subscribe(observer);
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
        this.DeleteCode(id);
      }
    });
  }

  DeleteCode(id: number): void {
    debugger
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetAllCodes(1);
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
    this.codeHomeService.DeleteCode(id).subscribe(observer);
  }
  editCode(id: number): void {
    debugger
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
        if (res.Data) {
          this.code = res.Data;
          debugger
          this.codeForm.patchValue({
            QuestionCode: this.code.QuestionCode,
            arName: this.code.arName,
            enName: this.code.enName,
          });
          this.showLoader = false;
          this.add = false;
          const button = document.getElementById('addCodeBtn');
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
    this.codeHomeService.GetCodeById(id).subscribe(observer);
  }
  updateCode() {
    debugger
    this.showLoader = true;
    if (this.codeForm.valid) {
      const Model: IAddCode = {
        QuestionCode: this.codeForm.value.QuestionCode,
        arName: this.codeForm.value.arName,
        enName: this.codeForm.value.enName,
      };
      const observer = {
        next: (res: any) => {
          debugger
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAllCodes(1);
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
      this.codeHomeService.UpdateCode(this.id, Model).subscribe(observer);
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
  reset() {
    this.add = true;
    this.codeForm = this.formBuilder.group({
      QuestionCode: ['', Validators.required],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
    });
  }
  onlyNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }
}