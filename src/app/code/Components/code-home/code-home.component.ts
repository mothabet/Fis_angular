import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddCode, ICode } from '../../Dtos/CodeHomeDto';
import { CodeHomeService } from '../../Services/code-home.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { IAddSubCode, ISubCode } from '../../Dtos/SubCodeHomeDto';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { arabicFont } from 'src/app/shared/services/arabic-font';
import { SubCodeHomeService } from '../../Services/sub-code-home.service';

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
  addSubCode: IAddSubCode[] = [];
  subCodes: ISubCode[] = [];
  subCode!: ISubCode;
  showLoader: boolean = false;
  noData: boolean = false;
  add: boolean = true;
  id: number = 0;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  typeId : number = 1;
  tableColumns = ['English Full Name', 'الاسم بالكامل', 'الرمز','الرقم'];
  searchText: string = '';
  isDropdownOpen = false;
  searchTerm: string = '';
  filteredSubCodes: ISubCode[] = [];
  QuestionCode:string='';
  enName:string='';
  constructor(
    private formBuilder: FormBuilder,
    private codeHomeService: CodeHomeService,
    private subCodeHomeService: SubCodeHomeService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.codeForm = this.formBuilder.group({
      arName: [''],
      enName: ['', Validators.required],
      QuestionCode: [''],
      TypeId: [1,Validators.required],
      searchTerm:['']
    });

    this.GetAllCodes(this.currentPage);
    this.GetAllSubCodes();
  }
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  filterSubCodes() {
    this.filteredSubCodes = this.subCodes.filter(code =>
      code.arName.includes(this.searchTerm)
    );
  }

  selectCode(code: ISubCode) {
    this.searchTerm = code.arName;
    this.isDropdownOpen = false;
    this.codeForm.patchValue({ arName: code.arName });
    this.GetSubCodesById(code.Id);
    // Perform any additional logic, like setting a FormControl value
  }
  addRow(){
    this.addSubCode.push({
      QuestionCode: '',
      arName: '',
      enName: '',
      Id:0
    });
  }
  updateSubCode(index: number, field: keyof IAddSubCode, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
  
    // Ensure that value is correctly assigned based on field type
    if (field === 'QuestionCode' || field === 'arName' || field === 'enName') {
      this.addSubCode[index][field] = value;
    }
  }
  removeItem(index: number): void {
    this.addSubCode.splice(index, 1);
  }
  areAllFieldsFilled(): boolean {
    return this.addSubCode.every(item => item.arName && item.enName);
  }
  onPageChange(page: number) {
    
    this.currentPage = page;
    this.GetAllCodes(page);
  }
  saveCode(): void {
    debugger
    this.showLoader = true;
    if (this.codeForm.valid && this.codeForm.value.TypeId == "1") {
      // Check if subCode has more than zero entries and each entry has valid values
      if (this.addSubCode.length === 0 || !this.addSubCode.every(sub => sub.arName && sub.enName)) {
        Swal.fire({
          icon: 'error',
          title: 'يجب ادخال بيانات الجدول بشكل صحيح',
          showConfirmButton: false,
          timer: 2000
        });
        this.showLoader = false;
        return;
      }
    }
    if (this.codeForm.valid && this.searchTerm != "") {
      const Model: IAddCode = {
        QuestionCode: this.codeForm.value.QuestionCode,
        arName: this.searchTerm,
        enName: this.codeForm.value.enName,
        TypeId:Number(this.codeForm.value.TypeId),
        addSubCodeDtos : this.addSubCode
      };
      
      console.log(this.addSubCode);
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
      TypeId : null
    });
    this.addSubCode = [];
    this.add = true;
  }
  GetAllCodes(page: number, textSearch : string = ''): void {
    
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.codes = res.Data.getCodeDtos;
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.resetForm();
        }
        else {
          this.codes = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.codeHomeService.GetAllCodes(page,textSearch).subscribe(observer);
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
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        
        if (res.Data) {
          this.code = res.Data.codeDto;
          this.addSubCode = res.Data.getSubCodeDtos
          
          this.codeForm.patchValue({
            QuestionCode: this.code.QuestionCode,
            arName: this.code.arName,
            enName: this.code.enName,
            TypeId:this.code.TypeId,
          });
          debugger
          this.searchTerm = this.code.arName;
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
    this.showLoader = true;
    if (this.codeForm.valid && this.codeForm.value.TypeId == "1") {
      // Check if subCode has more than zero entries and each entry has valid values
      if (this.addSubCode.length === 0 || !this.addSubCode.every(sub => sub.arName && sub.enName)) {
        Swal.fire({
          icon: 'error',
          title: 'يجب ادخال بيانات الجدول بشكل صحيح',
          showConfirmButton: false,
          timer: 2000
        });
        this.showLoader = false;
        return;
      }
    }
    if (this.codeForm.valid && this.searchTerm != "") {
      const Model: IAddCode = {
        QuestionCode: this.codeForm.value.QuestionCode,
        arName: this.searchTerm,
        enName: this.codeForm.value.enName,
        TypeId:this.codeForm.value.TypeId,
        addSubCodeDtos: this.addSubCode
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
    this.addSubCode = [];
    this.add = true;
    this.codeForm = this.formBuilder.group({
      QuestionCode: ['', Validators.required],
      arName: ['', Validators.required],
      enName: ['', Validators.required],
      TypeId : [null, Validators.required]
    });
  }
  onlyNumber(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }
  printPdf() {
    this.generatePdf(this.codes, this.tableColumns);
  }
  generatePdf(data: any[], columns: string[]) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    // Add the Arabic font to jsPDF
    doc.addFileToVFS('Arabic-Regular.ttf', arabicFont);
    doc.addFont('Arabic-Regular.ttf', 'Arabic', 'normal');
    doc.setFont('Arabic');

    // Add a title
    doc.text('محتوي الاستماره', 10, 10);

    // Generate the table
    autoTable(doc, {
      head: [columns],
      body: data.map((item, index) => [
        item.enName,
        item.arName,
        item.QuestionCode,
        index +1,
      ]),
      styles: {
        font: 'Arabic',
        halign: 'right' // Horizontal alignment
      },
      bodyStyles: {
        halign: 'right'
      },
      headStyles: {
        halign: 'right'
      }
    });

    // Save the PDF
    doc.save('Codes.pdf');
  }
  codeSearch(){
    this.GetAllCodes(this.currentPage,this.searchText);
  }
  GetAllSubCodes(page: number=0, textSearch : string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {        
        if (res.Data) {
          this.subCodes = res.Data.getSubCodeDtos;
          this.filteredSubCodes = this.subCodes;
        }
        else {
          this.subCodes = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.subCodeHomeService.GetAllSubCodes(page,textSearch).subscribe(observer);
  }
  GetSubCodesById(id:number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
          this.subCode = res.Data;
          console.log(this.subCode);
          this.enName = this.subCode.enName;
          this.QuestionCode = this.subCode.QuestionCode;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.subCodeHomeService.GetSubCodesById(id).subscribe(observer);
  }
}
