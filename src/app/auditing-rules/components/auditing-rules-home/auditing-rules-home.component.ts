import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { CodeHomeService } from 'src/app/code/Services/code-home.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { IAddAuditRule } from '../../Dtos/CodeHomeDto';
import { AuditRuleHomeService } from '../../Services/audit-rule-home.service';

@Component({
  selector: 'app-auditing-rules-home',
  templateUrl: './auditing-rules-home.component.html',
  styleUrls: ['./auditing-rules-home.component.css']
})
export class AuditingRulesHomeComponent implements OnInit {
  auditForm!: FormGroup;
  codes: ICode[] = [];
  showLoader: boolean = false;
  selects: { options: ICode[], disabled: boolean }[] = [];
  usedOptions: Set<string> = new Set(); // لتتبع القيم المستخدمة

  constructor(private fb: FormBuilder, private codeHomeService: CodeHomeService,
    private sharedService: SharedService, private auditRuleHomeService:AuditRuleHomeService) { }

  ngOnInit() {
    this.auditForm = this.fb.group({
      Rule: ['']
    });
    this.GetAllCodes(1); // لتحميل البيانات عند البدء
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
        Rule:this.auditForm.value.Rule,
      };
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancel');
          if (button) {
            button.click();
          }
          this.resetForm();
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
}
