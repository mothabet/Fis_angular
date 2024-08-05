import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { CodeHomeService } from 'src/app/code/Services/code-home.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { IAddAuditRule, IAuditRule } from '../../Dtos/CodeHomeDto';
import { AuditRuleHomeService } from '../../Services/audit-rule-home.service';
import autoTable from 'jspdf-autotable';
import { arabicFont } from 'src/app/shared/services/arabic-font';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-auditing-rules-home',
  templateUrl: './auditing-rules-home.component.html',
  styleUrls: ['./auditing-rules-home.component.css']
})
export class AuditingRulesHomeComponent implements OnInit {
  auditForm!: FormGroup;
  codes: ICode[] = [];
  auditRules: IAuditRule[] = [];
  showLoader: boolean = false;
  selects: { options: ICode[], disabled: boolean }[] = [];
  usedOptions: Set<string> = new Set(); // لتتبع القيم المستخدمة
  noData: boolean = false;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  tableColumns = ['تاريخ الانشاء','معادلة التدقيق', 'الرقم'];
  constructor(private fb: FormBuilder, private codeHomeService: CodeHomeService,
    private sharedService: SharedService, private auditRuleHomeService: AuditRuleHomeService) { }

  ngOnInit() {
    this.auditForm = this.fb.group({
      Rule: ['']
    });
    this.GetAllCodes(1); // لتحميل البيانات عند البدء
    this.GetAuditRules(1); // لتحميل البيانات عند البدء
  }
  onPageChange(page: number) {
    
    this.currentPage = page;
    this.GetAllCodes(page);
  }
  addSelect() {
    const availableOptions = this.getAvailableOptions();

    if (availableOptions.length > 0) {
      this.selects.push({ options: availableOptions, disabled: false });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'لا يوجد بيانات',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  getAvailableOptions(): ICode[] {
    console.log('Used Options:', Array.from(this.usedOptions)); // تحقق من القيم في Set
    return this.codes.filter(code => {
      const questionCode = String(code.QuestionCode).trim();
      return !this.usedOptions.has(questionCode);
    });
  }
  onSelectChange(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.usedOptions.add(selectedValue);

    let currentValue = this.auditForm.get('Rule')?.value || '';

    if (currentValue === '') {
      currentValue = `${selectedValue}=`;
    } else if (currentValue.endsWith('=')) {
      currentValue = `${currentValue}${selectedValue}`;
    } else {
      currentValue = `${currentValue}+${selectedValue}`;
    }

    this.auditForm.patchValue({ Rule: currentValue });

    // تعطيل الـ <select> بعد اختيار القيمة
    this.selects[index].disabled = true;
  }
  // دالة للتحقق من صحة المعادلة
  isEquationValid(): boolean {
    const questionCode = this.auditForm.get('Rule')?.value || '';
    const parts = questionCode.split(/=|\+/).filter((part: string) => part.trim() !== '');
    return parts.length >= 3;
  }
  resetForm() {
    this.selects = []; // إزالة جميع الـ <select>ات
    this.usedOptions.clear(); // مسح جميع الخيارات المستخدمة
    this.auditForm.patchValue({ Rule: '' }); // إفراغ حقل النص
  }
  GetAllCodes(page: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        if (res.Data) {
          
          this.codes = res.Data.getCodeDtos;
          this.resetForm();
        } else {
          this.codes = [];
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.codeHomeService.GetAllCodes(page).subscribe(observer);
  }
  SaveAuditRule(): void {
    this.showLoader = true;
    if (this.auditForm.valid) {
      const Model: IAddAuditRule = {
        Rule: this.auditForm.value.Rule,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.GetAuditRules(1);
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
      this.auditRuleHomeService.AddAuditRules(Model).subscribe(observer);
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
  GetAuditRules(page: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.auditRules = res.Data.getAuditRuleDtos;
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.resetForm();
        }
        else {
          this.auditRules = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.auditRuleHomeService.GetAllAuditRules(page).subscribe(observer);
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
        this.DeleteAuditRule(id);
      }
    });
  }
  DeleteAuditRule(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetAuditRules(1);
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
    this.auditRuleHomeService.DeleteAuditRule(id).subscribe(observer);
  }
  printPdf() {
    this.generatePdf(this.auditRules, this.tableColumns);
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
    doc.text('قواعد التدقيق', 10, 10);
    
    // Generate the table
    autoTable(doc, {
      head: [columns],
      body: data.map((item, index) => [
        this.getDateOnly(item.CreatedOn),
        item.Rule,
        index + 1,
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
    doc.save('AuditingRules.pdf');
  }
  getDateOnly(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toISOString().split('T')[0];
  }
  editCode(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.auditRuleHomeService.GetAllAuditRules(id).subscribe(observer);
  }
  // updateCode() {
  //   this.showLoader = true;
  //   if (this.codeForm.valid) {
  //     const Model: IAddCode = {
  //       QuestionCode: this.codeForm.value.QuestionCode,
  //       arName: this.codeForm.value.arName,
  //       enName: this.codeForm.value.enName,
  //       TypeId:this.codeForm.value.TypeId,
  //       addSubCodeDtos: this.subCode
  //     };
  //     const observer = {
  //       next: (res: any) => {
  //         debugger
  //         const button = document.getElementById('btnCancel');
  //         if (button) {
  //           button.click();
  //         }
  //         this.resetForm();
  //         this.GetAllCodes(1);
  //         this.showLoader = false;
  //         Swal.fire({
  //           icon: 'success',
  //           title: res.Message,
  //           showConfirmButton: false,
  //           timer: 2000
  //         });
  //       },
  //       error: (err: any) => {
  //         debugger
  //         this.sharedService.handleError(err);
  //         this.showLoader = false;
  //       },
  //     };
  //     this.codeHomeService.UpdateCode(this.id, Model).subscribe(observer);
  //   } else {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'يجب ادخال البيانات بشكل صحيح',
  //       showConfirmButton: false,
  //       timer: 2000
  //     });
  //     this.showLoader = false;
  //   }
  // }
}
