import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import Swal from 'sweetalert2';
import { ICoverFormDetailsDto, IQuarterCoverFormDataDto } from 'src/app/Forms/Dtos/FormDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { NavigateTablesTypesService } from '../../services/navigate-tables-types.service';
import { IAddFormDataDto, IDataDto } from '../../Dtos/FormDataDto';
import { IAuditRule } from 'src/app/auditing-rules/Dtos/CodeHomeDto';
import { AuditRuleHomeService } from 'src/app/auditing-rules/Services/audit-rule-home.service';
import { forkJoin } from 'rxjs';
import { IAddFormNotesDto, IAddInstructionsDto, IAddListFormNotesDto, IAddListInstructionsDto } from '../../Dtos/NavigateDto';
import { FormNotesService } from 'src/app/form-notes/services/form-notes.service';
import { InstructionsService } from 'src/app/instructions/services/instructions.service';

@Component({
  selector: 'app-navigate-tables-types',
  templateUrl: './navigate-tables-types.component.html',
  styleUrls: ['./navigate-tables-types.component.css']
})
export class NavigateTablesTypesComponent implements OnInit {
  @Input() coverForm!: ICoverFormDetailsDto;
  @Input() tapType!: number;
  @Input() isCoverActive: boolean = false;
  @Input() isWorkDataActive: boolean = false;
  @Input() isCertificationActive: boolean = false;
  @Input() sharedTableType!: number;
  @Output() coverActivated: EventEmitter<void> = new EventEmitter();
  @Output() workDataActivated: EventEmitter<void> = new EventEmitter();
  @Output() certificationActivated: EventEmitter<void> = new EventEmitter();
  @Output() sharedType: EventEmitter<void> = new EventEmitter();
  @Output() setInLocalStorage = new EventEmitter<void>();
  Loader: boolean = false;
  tableType!: number;
  formId!: string;
  role: string = "";
  temp: string = "";
  companyId!: string;
  tableId: number | null = null;
  @Input() table!: IGetTableDto;
  formContents: any[] = [];
  quarterCoverForm !: IQuarterCoverFormDataDto;
  auditRules: IAuditRule[] = [];
  addFormNotesDto: IAddFormNotesDto[] = [];
  addInstructions: IAddInstructionsDto[] = [];
  add: boolean = true;
  constructor(private authService: LoginService, private activeRouter: ActivatedRoute,
    private sharedServices: SharedService, private formServices: FormService, private router: Router,
    private navigateTablesTypesService: NavigateTablesTypesService, private formNotesService: FormNotesService,
    private auditRuleHomeService: AuditRuleHomeService, private instructionsService: InstructionsService) { }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    const tableIdParam = this.activeRouter.snapshot.paramMap.get('tableId');
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);
    this.role = result.roles;
    this.tableId = tableIdParam ? +tableIdParam : null;
    this.GetFormById(this.formId ?? "0")
  }
  ngOnChanges() {
    const tableIdParam = this.activeRouter.snapshot.paramMap.get('tableId');
    this.tableId = tableIdParam ? +tableIdParam : null;
  }
  TablesNavigation(id: number) {
    this.GetTableById(id);
    this.displayFormContents();
  }
  GetTableById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        this.tableType = res.Data.Type;
        this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
        let navigationPromise;
        switch (this.tableType) {
          case 1:
            navigationPromise = this.router.navigate(['/TransTable', this.formId, id, this.companyId]);
            break;
          case 2:
            navigationPromise = this.router.navigate(['/TableWithoutTrans', this.formId, id, this.companyId]);
            break;
          case 4:
            navigationPromise = this.router.navigate(['/TwoYearsWithParts', this.formId, id, this.companyId]);
            break;
          case 3:
            navigationPromise = this.router.navigate(['/OneYearWithParts', this.formId, id, this.companyId]);
            break;
          case 5:
            navigationPromise = this.router.navigate(['/PeriodTable', this.formId, id, this.companyId]);
            break;
          case 6:
            navigationPromise = this.router.navigate(['/TablePercentageWithoutTrans', this.formId, id, this.companyId]);
            break;
          case 0:
            navigationPromise = this.router.navigate(['/QuarterTable', this.formId, id, this.companyId]);
            break;
          default:
            return;
        }
        this.displayFormContents();
        // navigationPromise.then(() => {
        //   window.location.reload();
        // }).catch((err) => {
        //   console.error('Navigation error:', err);
        // });
        this.Loader = false;

      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetTableById(id).subscribe(observer);
  }
  activateCover() {
    this.coverActivated.emit();
    this.tableId = null;
  }
  activateWorkData() {
    this.workDataActivated.emit();
    this.tableId = null;
  }
  certificationWorkData() {
    this.certificationActivated.emit();
    this.tableId = null;
  }
  displayFormContents() {
    if (this.table === undefined)
      return;
    if (this.table.Type == "0")
      this.addTableToListInLocalStorage(this.table);
    else if (this.table.Type == "1")
      this.addTableToListInLocalStorage(this.table);
    else if (this.table.Type == "2")
      this.addTableToListInLocalStorage(this.table);
    else if (this.table.Type == "6")
      this.addTableToListInLocalStorage(this.table);
    else if (this.table.Type == "3")
      this.addTableToListInLocalStorage(this.table);
    else if (this.table.Type == "4")
      this.addTableToListInLocalStorage(this.table);
    else if (this.table.Type == "5")
      this.addTableToListInLocalStorage(this.table);
  }
  addTableToListInLocalStorage(table: any): void {
    let storedTables = localStorage.getItem(`coverForm${this.coverForm.id}`);
    var coverForm!: ICoverFormDetailsDto
    if (storedTables) {
      coverForm = JSON.parse(storedTables);
      const tableIndex = coverForm.tables.findIndex(t => t.id === table.id);
      if (tableIndex !== -1) {
        coverForm.tables[tableIndex] = table;
      }
      localStorage.removeItem(`coverForm${this.coverForm.id}`);
    }

    localStorage.setItem(`coverForm${this.coverForm.id}`, JSON.stringify(coverForm));
  }
  removeTable(tableId: number): void {
    const storedTables = localStorage.getItem(`tablesList${this.coverForm.id}`);
    if (storedTables) {
      let tablesList: any[] = JSON.parse(storedTables);
      const tableIndex = tablesList.findIndex(t => t.id === tableId);
      if (tableIndex !== -1) {
        tablesList.splice(tableIndex, 1);
        localStorage.setItem(`tablesList${this.coverForm.id}`, JSON.stringify(tablesList));
      }
    }
  }
  CompleteForm(): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        this.coverForm.status = 7;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: true,
          confirmButtonText: 'اغلاق'
        });
      }
      ,
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.CompleteForm(+this.formId, +this.companyId).subscribe(observer);

  }
  CloseForm(): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        this.coverForm.status = 6;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: true,
          confirmButtonText: 'اغلاق'
        });
      }
      ,
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.CloseForm(+this.formId, +this.companyId).subscribe(observer);
  }
  OpenForm() {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        this.coverForm.status = 8;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: true,
          confirmButtonText: 'اغلاق'
        });
      }
      ,
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.OpenForm(+this.formId, +this.companyId).subscribe(observer);
  }
  GetFormById(id: string): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        debugger
        if (res.Data) {
          this.Loader = false;
          this.coverForm = res.Data;
          // let quarterCoverData = localStorage.getItem(`quarterCoverForm`);
          // if (quarterCoverData)
          //   this.coverForm.quarterCoverData = JSON.parse(quarterCoverData) as IQuarterCoverFormDataDto;
          const storedTables = localStorage.getItem(`coverForm${this.coverForm.id}`);
          if (!storedTables) {
            localStorage.setItem(`coverForm${this.coverForm.id}`, JSON.stringify(this.coverForm));
          }
          this.addTableToListInLocalStorage(this.table)
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(+id, '', +this.companyId).subscribe(observer);
  }
  SaveData(btnType: string, companyId: number) {
    this.Loader = true;
    this.setDataLocalStorage()
    forkJoin([
      this.auditRuleHomeService.GetAllAuditRules(0),
    ]).subscribe({
      next: (auditRulesResponse: any) => {
        if (auditRulesResponse[0].Data)
          this.auditRules = auditRulesResponse[0].Data.getAuditRuleDtos;
        this.displayFormContents();
        const storedTables = localStorage.getItem(`coverForm${this.coverForm.id}`);
        let coverForm!: ICoverFormDetailsDto;
        if (storedTables) {
          coverForm = JSON.parse(storedTables);
        }
        let dataDtosList: IDataDto[] = [];
        for (let index = 0; index < coverForm.tables.length; index++) {

          for (let i = 0; i < coverForm.tables[index].formContents.length; i++) {
            let codesList: number[] = [];
            if (coverForm.tables[index].formContents[i].values !== undefined) {
              // Extract rule code
              if (btnType == "Approve") {
                debugger
                const ruleCode = this.auditRules.find(a => a.codeParent == coverForm.tables[index].formContents[i].code.QuestionCode && a.Type == coverForm.Type.toString());
                if (ruleCode && ruleCode.Rule) {
                  const ruleParts = ruleCode.Rule.split('=');
                  if (ruleParts.length < 2) {
                    Swal.fire({
                      icon: 'error',
                      title: `تنسيق القاعدة غير صحيح: ${ruleCode.Rule}`,
                      showConfirmButton: true,
                      confirmButtonText: 'اغلاق'
                    });
                    continue;
                  }
                  const ruleExpression = ruleParts[1].trim();
                  // Extract numbers and operators
                  const numberPattern = /\d+/g; // Matches numeric values
                  const operatorPattern = /[\+\-]/g; // Matches operators
                  // Extract numbers and operators
                  const numbers = ruleExpression.match(numberPattern)?.map(val => Number(val.trim())) || [];
                  const operators = ruleExpression.match(operatorPattern) || [];

                  // Ensure correct length of operators and numbers
                  if (numbers.length === 0) {
                    Swal.fire({
                      icon: 'error',
                      title: `لم يتم العثور على أرقام صالحة في تعبير القاعدة: ${ruleExpression}`,
                      showConfirmButton: true,
                      confirmButtonText: 'اغلاق'
                    });
                    continue;
                  }
                  let valuesLength = coverForm.tables[index].formContents[i].values.length;


                  // Iterate over formContents
                  // for (let i = 0; i < coverForm.tables[index].formContents.length; i++) {

                  let formContent = coverForm.tables[index].formContents[i];
                  let subCodes = formContent.code.SubCodes;

                  // Reset sums for current formContent
                  let indexSums = new Array(valuesLength).fill(0);
                  // Accumulate values from SubCodes
                  for (let j = 0; j < subCodes.length; j++) {
                    let subCodeQuestionCode = Number(subCodes[j].QuestionCode);
                    if (numbers.includes(subCodeQuestionCode)) {
                      let subCodeValues = subCodes[j].values;

                      // Find the operator before the current number
                      let indexOfCode = numbers.indexOf(subCodeQuestionCode);
                      let operator = (indexOfCode > 0) ? operators[indexOfCode - 1] : '+';

                      // Apply the correct operation based on the operator
                      for (let k = 0; k < subCodeValues.length; k++) {
                        if (k < indexSums.length) {
                          if (operator === '-' || !operator) {
                            indexSums[k] -= subCodeValues[k];
                          } else {
                            indexSums[k] += subCodeValues[k];
                          }
                        }
                      }
                    }
                  }
                  let totalValues = new Array(valuesLength).fill(0); // Initialize totalValues based on length of values

                  // Add the accumulated sums to the totalValues
                  for (let l = 0; l < totalValues.length; l++) {
                    if (l < indexSums.length) {
                      totalValues[l] += indexSums[l];
                      if (coverForm.tables[index].formContents[i].values[l] !== totalValues[l]) {
                        debugger
                        if (coverForm.tables[index].formContents[i].values[l].toString() != "" && totalValues[l].toString() != "00") {
                          debugger
                          Swal.fire({
                            icon: 'error',
                            title: `في ${coverForm.tables[index].arName} يجب التحقق من القيم المرتبطة بالرمز ${coverForm.tables[index].formContents[i].code.QuestionCode}. حيث ان القيمة المتوقعة: ${totalValues[l]}, ولكن القيمة الحالية: ${coverForm.tables[index].formContents[i].values[l]}`,
                            showConfirmButton: true,
                            confirmButtonText: 'اغلاق'
                          });
                          this.Loader = false;
                          return;
                        }

                      }
                    }
                  }
                  // }
                }
              }

              for (let j = 0; j < coverForm.tables[index].formContents[i].values.length; j++) {
                debugger
                let codes = coverForm.tables[index].formContents[i].values[j];
                if (codes.toString() === "") {
                  codes = 0; // Replace empty string with 0
                }
                codesList.push(codes);
              }
debugger
              let dataDtos: IDataDto = {
                TableId: coverForm.tables[index].id,
                TableArName: coverForm.tables[index].arName,
                TableEnName: coverForm.tables[index].enName,
                questionId: coverForm.tables[index].formContents[i].code.QuestionCode,
                codes: codesList,
                level: 1,
                codeId: coverForm.tables[index].formContents[i].code.Id,
                codeType: coverForm.tables[index].formContents[i].code.TypeId,
                valueCheck: coverForm.tables[index].formContents[i].valueCheck,
                parentCodeId: 0,
                connectedWithId: coverForm.tables[index].formContents[i].code.connectedWithId,
                connectedWithLevel: coverForm.tables[index].formContents[i].code.connectedWithLevel,
                connectedWithType: coverForm.tables[index].formContents[i].code.connectedWithType,
                arName: coverForm.tables[index].formContents[i].code.arName,
                enName: coverForm.tables[index].formContents[i].code.enName,
              };
              dataDtosList.push(dataDtos);
              for (let r = 0; r < coverForm.tables[index].formContents[i].code.SubCodes.length; r++) {
                let dataDtosSub: IDataDto = {
                  TableId: coverForm.tables[index].id,
                  TableArName: coverForm.tables[index].arName,
                  TableEnName: coverForm.tables[index].enName,
                  questionId: coverForm.tables[index].formContents[i].code.SubCodes[r].QuestionCode,
                  codes: coverForm.tables[index].formContents[i].code.SubCodes[r].values,
                  level: 2,
                  codeId: coverForm.tables[index].formContents[i].code.SubCodes[r].Id,
                  codeType: 0,
                  valueCheck: coverForm.tables[index].formContents[i].code.SubCodes[r].valueCheck,
                  parentCodeId: coverForm.tables[index].formContents[i].code.Id,
                  connectedWithId: coverForm.tables[index].formContents[i].code.SubCodes[r].connectedWithId,
                  connectedWithLevel: coverForm.tables[index].formContents[i].code.SubCodes[r].connectedWithLevel,
                  connectedWithType: coverForm.tables[index].formContents[i].code.SubCodes[r].connectedWithType,
                  arName: coverForm.tables[index].formContents[i].code.SubCodes[r].arName,
                  enName: coverForm.tables[index].formContents[i].code.SubCodes[r].enName,

                };
                dataDtosList.push(dataDtosSub);
              }
            }
          }
        }

        let coverFormData = localStorage.getItem(`quarterCoverForm`) || localStorage.getItem(`coverFormData`) || '';
        let certification = localStorage.getItem(`certification`) || '';
        let generalData = localStorage.getItem(`generalData`) || '';
        debugger
        let addFormDataDto: IAddFormDataDto = {
          dataDtos: dataDtosList,
          FormId: this.coverForm.id,
          coverData: coverFormData,
          certificationData: certification,
          GeneralData: generalData,
        };

        const observer = {
          next: (res: any) => {
            this.GetFormById(this.formId);
            this.Loader = false;
            Swal.fire({
              icon: 'success',
              title: res.Message,
              showConfirmButton: true,
              confirmButtonText: 'اغلاق'
            });
          },
          error: (err: any) => {
            this.sharedServices.handleError(err);
            this.Loader = false;
          },
        };

        this.navigateTablesTypesService.AddFormData(addFormDataDto, btnType, companyId).subscribe(observer);
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    });
  }

  setDataLocalStorage() {
    this.setInLocalStorage.emit();
  }
  addRow() {
    this.addFormNotesDto.push({
      arName: '',
      enName: '',
    });
  }
  areAllFieldsFilled(): boolean {
    return this.addFormNotesDto.every(item => item.arName && item.enName);
  }
  updateFormNotes(index: number, field: keyof IAddFormNotesDto, event: Event): void {
    const inputElement = event.target as HTMLSelectElement | HTMLInputElement;
    const value = inputElement.value;
    if (field === 'arName' || field === 'enName') {
      this.addFormNotesDto[index][field] = value;
    }
  }
  removeItem(index: number): void {
    this.addFormNotesDto.splice(index, 1);
  }
  resetForm(): void {
    this.addFormNotesDto = [];
    this.add = true;
  }
  saveFormNotes() {
    this.Loader = true;
    for (const addFormDataDto_ of this.addFormNotesDto) {
      if (addFormDataDto_.arName == '' || addFormDataDto_.enName == '') {
        this.Loader = false;
        Swal.fire({
          icon: 'error',
          title: 'يجب إدخال الملاحظه بالعربي والانجليزي',
          showConfirmButton: true,
          confirmButtonText: 'اغلاق'
        });
        return;
      }
    }
    const Model: IAddListFormNotesDto = {
      addFormNotesDtos: this.addFormNotesDto,
      companyId: this.companyId,
      formId: this.formId
    }
    const observer = {
      next: (res: any) => {
        const button = document.getElementById('btnCancel');
        if (button) {
          button.click();
        }
        this.resetForm();
        this.Loader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 2000
        });
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formNotesService.AddFormNotes(Model).subscribe(observer);
  }
  GetAllFormNotesByRole(role: string): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.addFormNotesDto = res.Data.getFormNotesDtos
          this.add = true;
          if (role != '') {
            const button = document.getElementById('ViewFormNotesBtn');
            if (button) {
              button.click();
            }
          }
          else {
            const button = document.getElementById('AddFormNotesBtn');
            if (button) {
              button.click();
            }
          }
          this.Loader = false;

        }
        else {
          Swal.fire({
            icon: 'error',
            title: res.Message,
            showConfirmButton: true,
            confirmButtonText: 'اغلاق'
          });
          this.Loader = false;

        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formNotesService.GetAllFormNotesByRole(role, this.formId, this.companyId, 0).subscribe(observer);
  }
  GetAllInstructions(role: string): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.addInstructions = res.Data.getInstructionsDtos
          this.add = true;
          if (role != '') {
            const button = document.getElementById('ViewInstructionsBtn');
            if (button) {
              button.click();
            }
          }
          else {
            const button = document.getElementById('AddInstructionsBtn');
            if (button) {
              button.click();
            }
          }
          this.Loader = false;

        }
        else {
          Swal.fire({
            icon: 'error',
            title: res.Message,
            showConfirmButton: true,
            confirmButtonText: 'اغلاق'
          });
          this.Loader = false;

        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.instructionsService.GetAllInstructions(role, this.formId, 0).subscribe(observer);
  }
}
