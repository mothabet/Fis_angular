import { Component, OnInit, Type } from '@angular/core';
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
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';
import { SubCodeHomeService } from 'src/app/code/Services/sub-code-home.service';
import { catchError, concat, finalize, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-auditing-rules-home',
  templateUrl: './auditing-rules-home.component.html',
  styleUrls: ['./auditing-rules-home.component.css']
})
export class AuditingRulesHomeComponent implements OnInit {
  auditForm!: FormGroup;
  codes: ISubCode[] = [];
  subCodes: ISubCode[] = [];
  auditRules: IAuditRule[] = [];
  showLoader: boolean = false;
  selects: { options: ISubCode[], disabled: boolean }[] = [];
  usedOptions: Set<string> = new Set(); // لتتبع القيم المستخدمة
  noData: boolean = false;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  tableColumns = ['تاريخ الانشاء', 'معادلة التدقيق', 'الرقم'];
  id: number = 0;
  isEditing: boolean = false;
  add: boolean = true;
  codeParent: string = "";
  constructor(private fb: FormBuilder, private codeHomeService: CodeHomeService,
    private subCodeHomeService: SubCodeHomeService,
    private sharedService: SharedService, private auditRuleHomeService: AuditRuleHomeService) { }

    ngOnInit() {
      this.auditForm = this.fb.group({
        Rule: [''],
        Type: [1],
      });
    
      this.showLoader = true; // Show loader before starting requests
      this.GetAllCodes(1);
      this.GetAuditRules(1);
    
      this.auditForm.get('Rule')?.valueChanges.subscribe(value => {
        const isValid = this.isValidEquation(value);
        this.auditForm.get('Rule')?.setErrors(isValid ? null : { invalidEquation: true });
      });
    }
    
  onPageChange(page: number) {
    this.currentPage = page;
  }
  addSelect() {
    if (this.selects.length > 0) {
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
    else {
      const availableOptions = this.getAvailableOptionsCode();
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
  }
  removeSelect(index: number) {
    const selectElement = document.querySelectorAll('select')[index] as HTMLSelectElement;
    const removedValue = selectElement.value;
  
    // Remove the select element
    this.selects.splice(index, 1);
  
    // Remove the value from usedOptions
    this.usedOptions.delete(removedValue);
  
    // Get current value of the Rule input
    let currentValue = this.auditForm.get('Rule')?.value || '';
  
    if (this.selects.length > 0) {
      // Re-add the removed value to the available options of the previous select
      if (index > 0) {
        this.selects[index - 1].options.push({
          QuestionCode: removedValue,
          // Add other properties of ICode if necessary
        } as ISubCode);
      }
  
      // Regex to remove the removed value and the operator before it
      const regex = new RegExp(`(\\+|\\-)?\\s*${removedValue}(\\+|\\-)?`, 'g');
      currentValue = currentValue.replace(regex, (match:any, p1:any, p2:any) => {
        if (p1 && p2) {
          return p2; // If there's an operator before and after, just keep the latter
        } else {
          return ''; // Otherwise, remove the whole match
        }
      }).trim();
  
      // Clean up any extra operators or spaces
      currentValue = currentValue.replace(/^\s*(\+|\-)/, ''); // Remove leading + or -
      currentValue = currentValue.replace(/(\+|\-)\s*$/, ''); // Remove trailing + or -
      currentValue = currentValue.replace(/\+\s*\+|\-\s*\-|\+\s*\-|\-\s*\+/g, (match:any) => match[0]); // Keep only one operator
      currentValue = currentValue.replace(/\=\s*(\+|\-)/, '='); // Ensure the equation doesn't start with + or - after =
  
    } else {
      currentValue = '';
    }
  
    // Update the rule in the form
    this.auditForm.patchValue({ Rule: currentValue });
  }
  getAvailableOptions(): ISubCode[] {
    return this.subCodes.filter(code => {
      const questionCode = String(code.QuestionCode).trim();
      return !this.usedOptions.has(questionCode);
    });
  }
  getAvailableOptionsCode(): ISubCode[] {
    return this.codes.filter(code => {
      const questionCode = String(code.QuestionCode).trim();
      return !this.usedOptions.has(questionCode);
    });
  }
  onSelectChange(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (index == 0) {
      const codeId = this.codes.filter((code: ISubCode) => code.QuestionCode == selectedValue);
      this.GetAllSubCodes(1, codeId[0].QuestionCode)
      this.codeParent = selectedValue;
    }

    this.usedOptions.add(selectedValue);
    let currentValue = this.auditForm.get('Rule')?.value || '';
    if (currentValue === '') {
      currentValue = `${selectedValue}=`;
    } else if (currentValue.endsWith('=')) {
      currentValue = `${currentValue}${selectedValue}`;
    }
    else if (currentValue.endsWith('+') || currentValue.endsWith('-')) {
      currentValue = `${currentValue}${selectedValue}`;
    }
    this.auditForm.patchValue({ Rule: currentValue });
    // Disable the select after choosing a value
    this.selects[index].disabled = true;
  }
  addPlus(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.usedOptions.add(selectedValue);
    let currentValue = this.auditForm.get('Rule')?.value || '';
    if (currentValue === '') {

    } else if (currentValue.endsWith('=')) {
    } 
    else if (currentValue.endsWith('+') || currentValue.endsWith('-')) {
      currentValue = `${currentValue.slice(0, -1)}`
      currentValue = `${currentValue}+`;
    } else {
      currentValue = `${currentValue}+`;
    }
    this.auditForm.patchValue({ Rule: currentValue });
    // Disable the select after choosing a value
  }
  addNegative(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.usedOptions.add(selectedValue);
    let currentValue = this.auditForm.get('Rule')?.value || '';
    if (currentValue === '') {

    } else if (currentValue.endsWith('=')) {

    } else if (currentValue.endsWith('+') || currentValue.endsWith('-')) {
      currentValue = `${currentValue.slice(0, -1)}`
      currentValue = `${currentValue}-`;
    }else {
      currentValue = `${currentValue}-`;
    }
    this.auditForm.patchValue({ Rule: currentValue });
    // Disable the select after choosing a value
  }
  isValidEquation(equation: string): boolean {
    // تحقق من أن المعادلة تحتوي على '='
    const equationParts = equation.split('=');
    if (equationParts.length !== 2) {
      return false;
    }
  
    const leftSide = equationParts[0].trim();
    const rightSide = equationParts[1].trim();
  
    // تحقق من أن الجانب الأيسر يحتوي على رقم واحد فقط
    // if (/^\d+$/.test(rightSide)) {
    //   return false;
    // }
  
    // تحقق من أن الجانب الأيمن يحتوي على أرقام وعمليات حسابية صحيحة
    // وتأكد من أن الجانب الأيمن يحتوي على أكثر من رقم واحد مفصول بعلامات العمليات
    const rightSideMatches = rightSide.match(/\d+/g);
    if (!rightSideMatches || rightSideMatches.length < 2) {
      return false;
    }
  
    return /^\d+([+-]\d+)*$/.test(rightSide);
  }  
  isSaveDisabled(): boolean {
    const ruleValue = this.auditForm.get('Rule')?.value || '';
  
    // // تحقق من أن المعادلة تحتوي على رقم واحد فقط في الطرف الأيسر
    // const leftSideMatch = ruleValue.match(/^(\d+)\s*=/);
    // const hasSingleNumberOnLeftSide = leftSideMatch && leftSideMatch[1].trim().split(/\s*[+-]\s*/).length === 1;
  
    // تحقق من صحة المعادلة كاملة
    const isValid = this.isValidEquation(ruleValue);
  
    // تمكين الأزرار إذا كانت المعادلة صحيحة وتحتوي على أكثر من رقم واحد في الجزء الأيمن
    return !isValid ;
  }  
  isLastCharacterValid(): boolean {
    const currentValue = this.auditForm.get('Rule')?.value || '';
    
    if (!currentValue.trim()) {
      return true; // Allow adding if input is empty
    }
  
    const lastChar = currentValue.trim().slice(-1); // Get the last non-whitespace character
    return lastChar === '=' || lastChar === '+' || lastChar === '-';
  }
  isLastCharacterValidPlus(): boolean {
    const currentValue = this.auditForm.get('Rule')?.value || '';
    
    if (!currentValue.trim()) {
      return true; // Allow adding if input is empty
    }
  
    const lastChar = currentValue.trim().slice(-1); // Get the last non-whitespace character
    return lastChar === '=' || lastChar === '-';
  }
  isLastCharacterValidNegative(): boolean {
    const currentValue = this.auditForm.get('Rule')?.value || '';
    
    if (!currentValue.trim()) {
      return true; // Allow adding if input is empty
    }
  
    const lastChar = currentValue.trim().slice(-1); // Get the last non-whitespace character
    return lastChar === '=' || lastChar === '+';
  }
  resetAuditRules() {
    this.selects = []; // إزالة جميع الـ <select>ات
    this.usedOptions.clear(); // مسح جميع الخيارات المستخدمة
    this.auditForm.patchValue({ Rule: '' , Type:1}); // إفراغ حقل النص
    this.id = 0;
    this.add = true;
  }
  GetAllCodes(page: number) {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.codes = res.Data.getCodeDtos;
          this.resetAuditRules();
        } else {
          this.codes = [];
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.codeHomeService.GetAllCodes(0,'',false).subscribe(observer);
  }
  GetAllSubCodes(page: number, questionCode: string) {
    const observer = {
      next: (res: any) => {

        if (res.Data) {
          this.subCodes = res.Data.getSubCodeDtos;
        } else {
          this.subCodes = [];
        }
      },
      error: (err: any) => {

        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.subCodeHomeService.GetAllSubCodes(0, '', questionCode).subscribe(observer);

  }
  SaveAuditRule(): void {
    this.showLoader = true;
    if (!this.auditForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return;
    }
    const Model: IAddAuditRule = {
      Rule: this.auditForm.value.Rule,
      Type: this.auditForm.value.Type,
      codeParent: Number(this.codeParent),
    };
    const observer = {
      next: (res: any) => {
        this.GetAuditRules(1)
        const button = document.getElementById('btnCancel');
        if (button) {
          button.click();
        }
        this.showLoader = false;
        if (res) {
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        }
      },
      error: (err: any) => {

        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.auditRuleHomeService.AddAuditRules(Model).subscribe(observer);
  }
  GetAuditRules(page: number) {
    this.noData = false;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.auditRules = res.Data.getAuditRuleDtos;
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.resetAuditRules();
        } else {
          this.auditRules = [];
          this.noData = !res.Data || res.Data.length === 0;

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
        this.GetAuditRules(1)
        this.showLoader = false;
        if (res) {
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        }
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
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // إضافة صفر في حالة كان الشهر أقل من 10
    const day = ('0' + date.getDate()).slice(-2); // إضافة صفر في حالة كان اليوم أقل من 10
    return `${year}-${month}-${day}`;
  }
  
  editAuditRules(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
          const rule = res.Data.Rule;
          this.codeParent = res.Data.codeParent;
          const codes = rule.split(/[=+-]/).map((code: any) => code.trim()).filter((code: any) => code);
          const observer = {
            next: (result: any) => {
              if (result.Data) {
                this.subCodes = result.Data.getSubCodeDtos;
              } else {
                this.subCodes = [];
              }
              // Clear previous selects and usedOptions
              this.selects = [];
              this.usedOptions.clear();

              // Populate selects with options
              codes.forEach((code: string, index: number) => {
                let availableOptions: ISubCode[] = []
                if (this.selects.length > 0) {
                  availableOptions = this.getAvailableOptions();
                }
                else {
                  availableOptions = this.getAvailableOptionsCode();
                }
                // Get available options for the select

                // Create a new select object
                this.selects.push({
                  options: availableOptions,
                  disabled: true // Disable all selects except the last one
                });

                // Add code to usedOptions
                this.usedOptions.add(code);
              });

              // Update form controls with the values
              this.auditForm.patchValue({ Rule: rule ,Type:res.Data.Type});

              // Set the value of each select element based on codes[i]
              setTimeout(() => {
                this.selects.forEach((select, i) => {
                  const code = codes[i];
                  if (code) {
                    const selectElement = document.querySelectorAll('select')[i] as HTMLSelectElement;
                    if (selectElement) {
                      selectElement.value = code; // Set the value of the select
                    }
                  }
                });
              }, 0); // Use setTimeout to ensure the DOM is updated
              this.showLoader = false;
              this.add = false;

              const button = document.getElementById('addAuditRulesBtn');
              if (button) {
                button.click();
              }
              this.id = id;
            },
            error: (err: any) => {

              this.sharedService.handleError(err);
              this.showLoader = false;
            },
          };
          this.subCodeHomeService.GetAllSubCodes(0, '', this.codeParent).subscribe(observer);

        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.auditRuleHomeService.GetAuditRulesById(id).subscribe(observer);
  }
  UpdateAuditRule() {
    if (!this.auditForm.valid) {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
      return;
    }

    const Model: IAddAuditRule = {
      Rule: this.auditForm.value.Rule,
      Type: this.auditForm.value.Type,
      codeParent: Number(this.codeParent),
    };

    this.showLoader = true;

    const observer = {
      next: (res: any) => {
        this.GetAuditRules(1)
        const button = document.getElementById('btnCancel');
        if (button) {
          button.click();
        }
        this.showLoader = false;
        if (res) {
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        }
      },
      error: (err: any) => {

        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.auditRuleHomeService.UpdateAuditRules(this.id, Model).subscribe(observer);
  }
}
