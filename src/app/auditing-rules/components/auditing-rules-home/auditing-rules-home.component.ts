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
  constructor(private fb: FormBuilder, private codeHomeService: CodeHomeService,
    private subCodeHomeService: SubCodeHomeService,
    private sharedService: SharedService, private auditRuleHomeService: AuditRuleHomeService) { }

  ngOnInit() {
    this.auditForm = this.fb.group({
      Rule: ['']
    });
    this.showLoader = true; // Show loader before starting requests

  concat(
    this.GetAllCodes(1),
    this.GetAllSubCodes(1),
    this.GetAuditRules(1)
  ).pipe(
    finalize(() => {
      this.showLoader = false; // Hide loader after all requests complete
    })
  ).subscribe({
    next: () => {},
    error: (err) => {
      this.sharedService.handleError(err);
    }
  });
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }

  addSelect() {
    debugger
    if(this.selects.length>0){
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
    else{
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
    
    const removedValue = (document.querySelectorAll('select')[index] as HTMLSelectElement).value;

    // Remove the select element
    this.selects.splice(index, 1);

    // Remove the value from usedOptions
    this.usedOptions.delete(removedValue);
    // Re-add the removed value to available options
    let currentValue = this.auditForm.get('Rule')?.value || '';
    if (this.selects.length > 0) {
      this.selects[index - 1].options.push({
        QuestionCode: removedValue,
        // Add other properties of ICode if necessary
      } as ISubCode);
      if (this.selects[index - 1].options) {

      }
      if (index != 1 || !(this.selects.length > 1)) {
        console.log(`${removedValue}index not equal 1`);
        const regex = new RegExp(`(^|\\+|\\=)${removedValue}(?=\\+|$)`, 'g');
        currentValue = currentValue.replace(regex, (match: string, p1: string) => (p1 === '=' ? p1 : ''));
      }
      else {
        console.log(`${removedValue}index equal 1`);
        const regex = new RegExp(`${removedValue}(^|\\+|\\=)`, 'g');
        currentValue = currentValue.replace(regex, (match: string, p1: string) => (p1 === '=' ? p1 : ''));
      }

      // Clean up any trailing '+' if necessary
      currentValue = currentValue.replace(/\+$/, '');
    }
    else {
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

    // Disable the select after choosing a value
    this.selects[index].disabled = true;
  }

  isEquationValid(): boolean {
    const rule = this.auditForm.get('Rule')?.value || '';
    const parts = rule.split(/=|\+/).filter((part: any) => part.trim() !== '');
    return parts.length >= 3;
  }

  resetAuditRules() {
    this.selects = []; // إزالة جميع الـ <select>ات
    this.usedOptions.clear(); // مسح جميع الخيارات المستخدمة
    this.auditForm.patchValue({ Rule: '' }); // إفراغ حقل النص
    this.id = 0;
    this.add = true;
  }
  GetAllCodes(page: number):  Observable<any>  {
    return this.codeHomeService.GetAllCodes(page).pipe(
      switchMap((res: any) => {
        if (res.Data) {
          this.codes = res.Data.getCodeDtos;
          this.resetAuditRules();
        } else {
          this.codes = [];
        }
        return of(null); // Continue to the next observable
      }),
      catchError(err => {
        this.sharedService.handleError(err);
        this.showLoader = false;
        return of(null); // Continue to the next observable
      })
    );
  }
  GetAllSubCodes(page: number): Observable<any> {
    return this.subCodeHomeService.GetAllSubCodes(page).pipe(
      switchMap((res: any) => {
        if (res.Data) {
          this.subCodes = res.Data.getSubCodeDtos;
          this.resetAuditRules();
        } else {
          this.subCodes = [];
        }
        return of(null); // Continue to the next observable
      }),
      catchError(err => {
        this.sharedService.handleError(err);
        this.showLoader = false;
        return of(null); // Continue to the next observable
      })
    );
  }
  SaveAuditRule(): void {
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
    };
  
    this.showLoader = true;
  
    this.auditRuleHomeService.AddAuditRules(Model).pipe(
      switchMap((res: any) => {
        // Call GetAuditRules to refresh the list
        return this.GetAuditRules(1).pipe(
          switchMap(() => {
            // Hide loader and show success message
            this.showLoader = false;
            return of(res); // Pass the response to the next switchMap
          })
        );
      }),
      finalize(() => {
        // Close the modal
        const button = document.getElementById('btnCancel');
        if (button) {
          button.click();
        }
      }),
      catchError((err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
        return of(null); // Complete observable chain
      })
    ).subscribe((res: any) => {
      if (res) {
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }
  
  GetAuditRules(page: number): Observable<any> {
    return this.auditRuleHomeService.GetAllAuditRules(page).pipe(
      switchMap((res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.auditRules = res.Data.getAuditRuleDtos;
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
          this.resetAuditRules();
        } else {
          this.auditRules = [];
        }
        return of(null); // Complete observable chain
      }),
      catchError(err => {
        this.sharedService.handleError(err);
        this.showLoader = false;
        return of(null); // Complete observable chain
      })
    );
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
  
    this.auditRuleHomeService.DeleteAuditRule(id).pipe(
      switchMap((res: any) => {
        // Call GetAuditRules to refresh the list
        return this.GetAuditRules(1).pipe(
          switchMap(() => {
            // Hide loader and return response to the next switchMap
            this.showLoader = false;
            return of(res);
          })
        );
      }),
      catchError((err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
        return of(null); // Complete observable chain
      })
    ).subscribe((res: any) => {
      if (res) {
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
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
  editAuditRules(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        if (res.Data) {
          
          const rule = res.Data.Rule;
          const codes = rule.split(/[=+]/).map((code: any) => code.trim()).filter((code: any) => code);

          // Clear previous selects and usedOptions
          this.selects = [];
          this.usedOptions.clear();

          // Populate selects with options
          codes.forEach((code: string, index: number) => {
            let availableOptions : ISubCode[]=[]
            if(this.selects.length > 0){
              availableOptions = this.getAvailableOptions();
            }
            else{
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
          this.auditForm.patchValue({ Rule: rule });

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
          this.add = false;

          const button = document.getElementById('addAuditRulesBtn');
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
    };
  
    this.showLoader = true;
  
    this.auditRuleHomeService.UpdateAuditRules(this.id, Model).pipe(
      switchMap((res: any) => {
        // Call GetAuditRules to refresh the list
        return this.GetAuditRules(1).pipe(
          switchMap(() => {
            // Hide loader and show success message
            this.showLoader = false;
            return of(res); // Pass the response to the next switchMap
          })
        );
      }),
      finalize(() => {
        // Close the modal
        const button = document.getElementById('btnCancel');
        if (button) {
          button.click();
        }
      }),
      catchError((err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
        return of(null); // Complete observable chain
      })
    ).subscribe((res: any) => {
      if (res) {
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 2000
        });
      }
    });
  }
  
  
}
