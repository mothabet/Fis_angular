import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IAuditRule } from 'src/app/auditing-rules/Dtos/CodeHomeDto';
import { AuditRuleHomeService } from 'src/app/auditing-rules/Services/audit-rule-home.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCode, ISubCodeForm } from 'src/app/code/Dtos/SubCodeHomeDto';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto } from 'src/app/Forms/Dtos/FormDto';
import { IGetQuestionDto } from 'src/app/Forms/Dtos/QuestionDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { SectorAndActivitiesService } from 'src/app/sectors-and-activities/Services/sector-and-activities.service';
import { IDataDto } from 'src/app/shared/Dtos/FormDataDto';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shared-table-with-period',
  templateUrl: './shared-table-with-period.component.html',
  styleUrls: ['./shared-table-with-period.component.css']
})
export class SharedTableWithPeriodComponent {
  Loader: boolean = false;
  isChecked!: boolean;
  @Input() formId!: string;
  @Input() tableId!: string;
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
  years: number[] = [];
  formYear: string = '';
  countries!: IGetCountriesDto[];
  activities!: IGetActivitiesDto[];
  companyId!: string;
  formData!: IDataDto[];
  checkFormData: boolean = false;
  auditRules: IAuditRule[] = [];

  constructor(private route: ActivatedRoute, private authService: LoginService, 
    private formServices: FormService, private sharedServices: SharedService,
    private sectorsAndActivitiesServices: SectorAndActivitiesService,
  private auditRuleHomeService : AuditRuleHomeService) {


  }
  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.formId = params.get('formId')!;
      this.tableId = params.get('tableId')!;
      this.companyId = params.get('companyId')!;
      this.GetFormById(+this.formId);
      this.GetActivites();
      this.GetCountrites();
    });
  }
  onArCountryChange(subCode: any) {
    const selectedCountry = this.countries.find(country => country.arName === subCode.arCountry);
    if (selectedCountry) {
      subCode.enCountry = selectedCountry.enName;
    }
  }
  getColspan(length: number, type: 'first' | 'second'): number {
    const halfLength = Math.floor(length / 2);
    return type === 'first' ? halfLength : halfLength + (length % 2);
  }
  onEnCountryChange(subCode: any) {
    const selectedCountry = this.countries.find(country => country.enName === subCode.enCountry);
    if (selectedCountry) {
      subCode.arCountry = selectedCountry.arName;
    }
  }
  GetTableById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          this.Loader = false;
          this.table = res.Data;
          this.generateYearsList(this.table.period);
          this.table.formContents.forEach((formContent: IGetQuestionDto) => {
            // Initialize the `values` array with zeroes, ensuring the first value is set to 0
            formContent.values = [0, ...Array(this.table.period).fill(0)];

            // Initialize the `values` array for each subCode
            if (formContent.code.SubCodes) {
              formContent.code.SubCodes.forEach((subCode: any) => {
                // Set the first value to 0, and the rest based on the number of parts
                subCode.values = [0, ...Array(this.years.length).fill(0)];
              });
            }
          });
        }
        this.GetFormData();
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetTableById(id).subscribe(observer);
  }
  GetFormById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          this.Loader = false;
          this.coverForm = res.Data;
          this.formYear = this.coverForm.reviewYear;
          this.GetTableById(+this.tableId);

        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id, '', +this.companyId).subscribe(observer);
  }
  generateYearsList(period: number): void {
    for (let i = 0; i < period; i++) {
      this.years.push(+this.formYear + i);
    }
    this.years = this.years.reverse()
  }
  addSubCodeRow(code: ICode) {

    const subCode: ISubCodeForm = {
      arName: '',
      codeId: 0,
      enName: '',
      Id: 0,
      QuestionCode: '',
      subCodes: [],
      values: [0, ...Array(this.years.length).fill(0)],
      connectedWithId: 0,
      connectedWithLevel: 0,
      connectedWithType:'',
      IsTrueAndFalse :false,
      IsTransaction:false,
      IsHdd:false,
      valueCheck:false
    }
    code.SubCodes.push(subCode);
  }
  GetActivites() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.activities = res.Data.getActivitiesDtos;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
      },
    };
    this.sectorsAndActivitiesServices.GetActivities(0, '').subscribe(observer);
  }
  GetCountrites() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.countries = res.Data.getCountryDtos;
        }
        else{
          this.countries = [];
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
      },
    };
    this.sectorsAndActivitiesServices.GetCountries(0, '').subscribe(observer);
  }
  addSubCodeToSubRow(SubCode: ISubCodeForm) {
    const subCode: ISubCodeForm = {
      arName: '',
      codeId: 0,
      enName: '',
      Id: 0,
      QuestionCode: '',
      subCodes: [],
      values: [0, ...Array(this.years.length).fill(0)],
      connectedWithId: 0,
      connectedWithLevel: 0,
      connectedWithType: '',
      IsTrueAndFalse: false,
      IsTransaction:false,
      IsHdd: false,
      valueCheck: false
    }

    SubCode.subCodes.push(subCode);
  }
  removeSubCodeFromSubRow(SubCode: ISubCodeForm, _subCode: ISubCodeForm): void {
    const index = SubCode.subCodes.indexOf(_subCode);
    if (index !== -1) {
      SubCode.subCodes.splice(index, 1); // Remove the subCode from the array
    }
  }
  GetFormData() {
    this.Loader = true;
    forkJoin([
      this.auditRuleHomeService.GetAllAuditRules(0),
    ]).subscribe({
      next: (auditRulesResponse: any) => {
        const observer = {
          next: (res: any) => {
            this.auditRules = auditRulesResponse[0].Data.getAuditRuleDtos;
            const isLoggedIn = this.authService.getToken();
            if (isLoggedIn != "") {
              let res_ = this.authService.decodedToken(isLoggedIn);
              var role = res_.roles;
              if (res.Data) {
                if (res.Data.length > 0) {
                  const groupedTables = res.Data[0].dataDtos.reduce((acc: any, item: any) => {
                    // Check if the TableId already exists in the accumulator
                    if (!acc[item.TableId]) {
                      acc[item.TableId] = {
                        TableId: item.TableId,
                        items: []
                      };
                    }
                    // Push the current item into the corresponding TableId group
                    acc[item.TableId].items.push(item);
                    return acc;
                  }, {});

                  // Convert the grouped object into an array of tables
                  const tablesList = Object.values(groupedTables);

                  const storedCoverForm = localStorage.getItem(`coverForm${this.coverForm.id}`);
                  if (storedCoverForm) {
                    this.coverForm = JSON.parse(storedCoverForm);
                  }
                  tablesList.forEach((table: any) => {
                    const tableIndex = this.coverForm.tables.findIndex(t => t.id == table.TableId);
                    if (tableIndex !== -1) {
                      this.coverForm.tables[tableIndex].IsDisabled = table.items[0].IsDisabled;

                      if (this.coverForm.tables[tableIndex].Type == "1") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: IGetQuestionDto) => {
                          formContent.values = formContent.values || [0, 0, 0];
                          formContent.values[1] = formContent.values[1] || 0;
                          formContent.values[2] = 0; // Set transaction explicitly to 0 since it's derived
                          formContent.values[0] = formContent.values[2] || 0;

                          // If there are subCodes, ensure their values are also initialized
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: ISubCodeForm) => {
                              // Initialize subCode `values` array if it doesn't exist
                              subCode.values = subCode.values || [0, 0, 0];

                              // Ensure the `values` array has the correct length and initial values
                              subCode.values[0] = subCode.values[0] || 0; // lastYear
                              subCode.values[2] = 0; // Set transaction explicitly to 0
                              subCode.values[1] = subCode.values[1] || 0; // nextYear
                              if (subCode.subCodes) {
                                subCode.subCodes.forEach((_subCode: any) => {
                                  // Initialize subCode `values` array if it doesn't exist
                                  _subCode.values = _subCode.values || [0, 0, 0];

                                  // Ensure the `values` array has the correct length and initial values
                                  _subCode.values[0] = _subCode.values[0] || 0; // lastYear
                                  _subCode.values[2] = 0; // Set transaction explicitly to 0
                                  _subCode.values[1] = _subCode.values[1] || 0; // nextYear
                                });
                              }
                            });
                          }
                        });
                      }
                      else if (this.coverForm.tables[tableIndex].Type == "2") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: any) => {
                          formContent.values = formContent.values || [0, 0];
                          formContent.values[0] = formContent.values[0] || 0;
                          formContent.values[1] = formContent.values[1] || 0;
                          // If there are subCodes, ensure their values are also initialized
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: any) => {

                              // Initialize subCode `values` array if it doesn't exist
                              subCode.values = subCode.values || [0, 0];

                              // Ensure the `values` array has the correct length and initial values
                              subCode.values[0] = subCode.values[0] || 0; // lastYear
                              subCode.values[1] = subCode.values[1] || 0; // nextYear
                              if (subCode.subCodes) {
                                subCode.subCodes.forEach((_subCode: any) => {
                                  // Initialize subCode `values` array if it doesn't exist
                                  _subCode.values = _subCode.values || [0, 0, 0];

                                  // Ensure the `values` array has the correct length and initial values
                                  _subCode.values[0] = _subCode.values[0] || 0; // lastYear
                                  _subCode.values[2] = 0; // Set transaction explicitly to 0
                                  _subCode.values[1] = _subCode.values[1] || 0; // nextYear
                                });
                              }
                            });
                          }
                        });
                      }
                      else if (this.coverForm.tables[tableIndex].Type == "6") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: any) => {
                          formContent.values = formContent.values || [0, 0, 0];
                          formContent.values[0] = formContent.values[0] || 0;
                          formContent.values[1] = formContent.values[1] || 0;
                          formContent.values[2] = formContent.values[2] || 0;
                          // If there are subCodes, ensure their values are also initialized
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: any) => {
                              // Initialize subCode `values` array if it doesn't exist
                              subCode.values = subCode.values || [0, 0];

                              // Ensure the `values` array has the correct length and initial values
                              subCode.values[0] = subCode.values[0] || 0; // lastYear
                              subCode.values[1] = subCode.values[1] || 0; // nextYear
                              subCode.values[2] = subCode.values[2] || 0; // nextYear

                            });
                          }
                        });
                      }
                      else if (this.coverForm.tables[tableIndex].Type == "3" || this.coverForm.tables[tableIndex].Type == "7") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: IGetQuestionDto) => {
                          // Initialize the `values` array with zeroes, ensuring the first value is set to 0
                          formContent.values = [0, ...Array(this.coverForm.tables[tableIndex].tableParts.length).fill(0)];
                          // Initialize the `values` array for each subCode
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: any) => {
                              // Set the first value to 0, and the rest based on the number of parts
                              subCode.values = [0, ...Array(this.coverForm.tables[tableIndex].tableParts.length).fill(0)];
                            });
                          }
                        });
                      }
                      else if (this.coverForm.tables[tableIndex].Type == "4") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: IGetQuestionDto) => {
                          // Calculate the total number of parts (doubled)
                          const totalPartsCount = this.coverForm.tables[tableIndex].tableParts.length * 2;

                          // Initialize the `values` array for the main content
                          formContent.values = Array(totalPartsCount).fill(0);

                          // Initialize the `values` array for each subcode
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: any) => {
                              subCode.values = Array(totalPartsCount).fill(0);
                            });
                          }
                        });
                      }
                      else if (this.coverForm.tables[tableIndex].Type == "5") {
                        this.coverForm.tables[tableIndex].formContents.forEach((formContent: IGetQuestionDto) => {
                          // Initialize the `values` array with zeroes, ensuring the first value is set to 0
                          formContent.values = [0, ...Array(this.coverForm.tables[tableIndex].period).fill(0)];

                          // Initialize the `values` array for each subCode
                          if (formContent.code.SubCodes) {
                            formContent.code.SubCodes.forEach((subCode: any) => {
                              // Set the first value to 0, and the rest based on the number of parts
                              subCode.values = [0, ...Array(this.coverForm.tables[tableIndex].period).fill(0)];
                            });
                          }
                        });
                      }
                    }
                    table.items.forEach((item: any) => {
                      if (item.codeType == 4) {
                        const level1ItemIndex_ = this.coverForm.tables[tableIndex].formContents.findIndex(fc => fc.codeId === item.codeId);
                        this.coverForm.tables[tableIndex].formContents[level1ItemIndex_].valueCheck = item.valueCheck
                      }
                      else if (item.level == 1) {
                        const level1ItemIndex = this.coverForm.tables[tableIndex].formContents.findIndex(fc => fc.codeId === item.codeId);
                        // Store the itemIndex of level 1 item
                        if (level1ItemIndex !== -1) {
                          if (this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.TypeId != 4 && this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.TypeId != 1)
                            this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes = [];
                          this.coverForm.tables[tableIndex].formContents[level1ItemIndex].values = item.codes;
                        }
                      }
                      else if (item.level == 2) {

                        // Find the corresponding level 1 item first
                        const level1ItemIndex = this.coverForm.tables[tableIndex].formContents.findIndex(fc => fc.codeId === item.parentCodeId);
                        if (level1ItemIndex !== -1) {
                          // Now find the correct subCode within the level 1 item's SubCodes
                          if (this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.TypeId == 1 || this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.TypeId == 4) {

                            const subCodes = this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes;
                            const subCodeIndex = subCodes.findIndex(subCode => subCode.Id === item.codeId);
                            if (subCodeIndex !== -1) {
                              subCodes[subCodeIndex].valueCheck = item.valueCheck
                              subCodes[subCodeIndex].values = item.codes;
                            }
                          }
                          else {
                            const subCode: ISubCodeForm = {
                              arName: item.arName,
                              codeId: item.parentCodeId,
                              enName: item.enName,
                              Id: 0,
                              QuestionCode: '',
                              subCodes: [],
                              values: item.codes,
                              connectedWithId: 0,
                              connectedWithLevel: 0,
                              connectedWithType: '',
                              IsTrueAndFalse: false,
                              IsTransaction:false,
                              IsHdd: false,
                              valueCheck: false
                            }
                            this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes.push(subCode)

                          }
                        }
                      }
                      else if (item.level == 3) {
                        const level1ItemIndex = this.coverForm.tables[tableIndex].formContents.findIndex(fc => fc.codeId === item.parentCodeId);
                        if (level1ItemIndex !== -1) {
                          const subCodeIndex = this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes.findIndex(subCode => subCode.Id === item.subCodeParentId);
                          if (subCodeIndex !== -1) {
                            if (this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes[subCodeIndex].IsHdd == true) {
                              debugger
                              const subCode: ISubCodeForm = {
                                arName: item.arName,
                                codeId: item.codeId,
                                enName: item.enName,
                                Id: 0,
                                QuestionCode: "",
                                subCodes: [],
                                values: item.codes,
                                connectedWithId: item.connectedWithId,
                                connectedWithLevel: item.connectedWithLevel,
                                connectedWithType: item.connectedWithType,
                                IsTrueAndFalse: false,
                                IsTransaction:false,
                                IsHdd: false,
                                valueCheck: item.valueCheck
                              }
                              const subCodeExists = this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes[subCodeIndex].subCodes
                                .some(existingSubCode => existingSubCode.arName === subCode.arName && existingSubCode.enName === subCode.enName
                                );
                              if (!subCodeExists)
                                this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes[subCodeIndex].subCodes.push(subCode);
                            }
                          }
                        }

                      }
                    });
                  });
                  localStorage.removeItem(`coverForm${this.coverForm.id}`);
                  localStorage.setItem(`coverForm${this.coverForm.id}`, JSON.stringify(this.coverForm));
                }
              }
              else if (role === 'Admin' || role === 'Researchers') {

                localStorage.removeItem(`coverForm${this.coverForm.id}`);
                // this.modifyInputById(this.coverForm.typeQuarter);
                return;
              }
              const storedCoverForm = localStorage.getItem(`coverForm${this.coverForm.id}`);
              if (storedCoverForm) {
                this.coverForm = JSON.parse(storedCoverForm);
              }

              const tableIndex = this.coverForm.tables.findIndex(t => t.id === +this.tableId);
              if (tableIndex !== -1 && this.coverForm.tables[tableIndex].formContents[0].values != undefined) {
                this.table = this.coverForm.tables[tableIndex];

                for (let index = 0; index < this.table.formContents.length; index++) {
                  const rule = this.auditRules.find(r => r.codeParent == this.table.formContents[index].code.QuestionCode && r.Type == "1")
                  if (rule) {
                    this.table.formContents[index].isRule = true;
                  }
                }
              }
            }
            // this.modifyInputById(this.coverForm.typeQuarter);
            this.Loader = false;
          },
          error: (err: any) => {
            this.sharedServices.handleError(err);
            this.Loader = false;
          },
        };
        this.formServices.GetFormData(+this.formId, +this.companyId, 0).subscribe(observer);
      }
    })
  }
  handelSupParent(formContent: IGetQuestionDto, subCode: ISubCodeForm, index: number) {
    // Ensure subCode has subCodes to process
    if (subCode.subCodes && subCode.subCodes.length > 0) {
      // Iterate over each subCode to update the first value
      subCode.subCodes.forEach(_subCode => {
        if (_subCode.values && _subCode.values.length > 1) {
          // Set _subCode.values[0] to the sum of all values except values[0]
          _subCode.values[0] = _subCode.values.slice(1).reduce((sum, value) => {
            return sum + value;
          }, 0);
        }
      });
  
      // Optionally, you can also update the parent subCode values array if needed
      for (let i = 0; i < subCode.values.length; i++) {
        subCode.values[i] = subCode.subCodes.reduce((sum, _subCode) => {
          return sum + (_subCode.values[i] || 0); // Safely sum the i-th value of each subCode
        }, 0);
      }
  
      // Assign the modified subCode back to formContent
      formContent.code.SubCodes[index] = subCode;
  
      // Call the parent handler method if needed
      this.handleParent(formContent);
    }
  }
  updateParentValue(subCode: any, formContent: any, index: number): void {
    // Initialize formContent values if not present
    if (!formContent.values) {
      formContent.values = [];
    }
  
    // Initialize subCode values if not present
    if (!subCode.values) {
      subCode.values = [];
    }
  
    // Calculate the sum of all subCode values for the given index
    let sum = 0;
    formContent.code.SubCodes.forEach((sub: any) => {
      if (sub.values && sub.values[index]) {
        sum += sub.values[index];
      }
    });
  
    // Update the parent formContent value with the sum
    formContent.values[index] = sum;
  
    // Optionally, update any other logic or status here if needed
  }
  
  handleParent(formContent: IGetQuestionDto) {
    this.changeStatus(this.coverForm.status,formContent,2);
    const rule = this.auditRules.find(r => r.codeParent == formContent.code.QuestionCode && r.Type == "1")
    if (rule) {
      const ruleParts = rule.Rule.split('=');
      if (ruleParts.length < 2) {
        Swal.fire({
          icon: 'error',
          title: `تنسيق القاعدة غير صحيح: ${rule.Rule}`,
          showConfirmButton: true,
          confirmButtonText: 'اغلاق'
        });
        return;
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
        return;
      }
      let valuesLength = formContent.values.length;
      let subCodes = formContent.code.SubCodes;

      // Reset sums for current formContent
      let indexSums = new Array(valuesLength).fill(0);
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
          formContent.values[l] = totalValues[l]
        }
      }
    }
    else{
      if (!formContent.values) {
        formContent.values = [];
      }
    
    
      // Calculate the sum of all subCode values for the given index
      for (let index = 0; index < formContent.values.length; index++) {
        let sum = 0;
        for (let i = 0; i < formContent.code.SubCodes.length; i++) {
          sum+=formContent.code.SubCodes[i].values[index]
        }
        formContent.values[index] = sum
      }
    }
    let foundFormContent = this.table.formContents.find(f => f.Id == formContent.Id);
    if (foundFormContent) {
        Object.assign(foundFormContent, formContent); // Update the object with new formContent properties
    }
    const storedCoverForm = localStorage.getItem(`coverForm${this.coverForm.id}`);
              if (storedCoverForm) {
                this.coverForm = JSON.parse(storedCoverForm);
              }
                const tableIndex = this.coverForm.tables.findIndex(t => t.id == this.table.id);
                if (tableIndex !== -1) {
                this.coverForm.tables[tableIndex]=this.table;
                localStorage.removeItem(`coverForm${this.coverForm.id}`);
                localStorage.setItem(`coverForm${this.coverForm.id}`, JSON.stringify(this.coverForm));
              }
    console.log(formContent)
  }
  changeStatus(status: number,formContent:IGetQuestionDto,level:number,indexFormContent : number=0) {
    if(level == 1){
      formContent.values[0] = 0;
      for (let index = 1; index < formContent.values.length; index++) {
          formContent.values[0] += formContent.values[index]
      }
      this.table.formContents[indexFormContent] = formContent;
    }
    else if(level == 2){
      for (let index = 0; index < formContent.code.SubCodes.length; index++) {
        formContent.code.SubCodes[index].values[0] = 0;
        for (let i = 1; i < formContent.code.SubCodes[index].values.length; i++) {
          formContent.code.SubCodes[index].values[0] += formContent.code.SubCodes[index].values[i]
        }
      }
    }
    if (status < 3)
      this.BeginningForm();
  }
  getSumOfValues(index: number): number {
    return this.table.formContents.reduce((sum, formContent) => {
      return sum + (formContent.values[index] || 0);
    }, 0);
  }
  BeginningForm(): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        debugger
        let storedTables = localStorage.getItem(`coverForm${this.coverForm.id}`);
        var coverForm!: ICoverFormDetailsDto
        if (storedTables) {
          coverForm = JSON.parse(storedTables);
          const tableIndex = coverForm.tables.findIndex(t => t.id === this.table.id);
          coverForm.status = 3;
          if (tableIndex !== -1) {
            coverForm.tables[tableIndex] = this.table;
          }
          localStorage.removeItem(`coverForm${this.coverForm.id}`);
        }

        localStorage.setItem(`coverForm${this.coverForm.id}`, JSON.stringify(coverForm));
        this.GetFormById(+this.formId)
        this.Loader = false;
      }
      ,
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    if (+this.companyId > 0) {
      this.formServices.BeginningForm(+this.formId, +this.companyId).subscribe(observer);
    }

  }
  
  clearIfZero(values: any[], index: number): void {
    if (values[index] === 0) {
        values[index] = null; // مسح القيمة إذا كانت تساوي صفرًا
    }
}

restoreIfNotPositive(values: number[], index: number): void {
    if (values[index] === null || values[index] <= 0) {
        values[index] = 0; // إعادة القيمة إلى صفر إذا كانت غير موجبة
    }
}
  removeSubCodeRow(code: ICode, subCode: ISubCodeForm): void {
    const index = code.SubCodes.indexOf(subCode);
    if (index !== -1) {
      code.SubCodes.splice(index, 1); // Remove the subCode from the array
    }
  }
}
