import { Component, Input } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCode, ISubCodeForm } from 'src/app/code/Dtos/SubCodeHomeDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto } from 'src/app/Forms/Dtos/FormDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { IGetQuestionDto } from 'src/app/Forms/Dtos/QuestionDto';
import { IDataDto } from 'src/app/shared/Dtos/FormDataDto';
import { LoginService } from 'src/app/auth/services/login.service';
import { SectorAndActivitiesService } from 'src/app/sectors-and-activities/Services/sector-and-activities.service';

@Component({
  selector: 'app-shared-two-years-with-parts',
  templateUrl: './shared-two-years-with-parts.component.html',
  styleUrls: ['./shared-two-years-with-parts.component.css']
})
export class SharedTwoYearsWithPartsComponent {
  @Input() formId!: string;
  @Input() tableId!: string;
  Loader: boolean = false;
  isChecked!: boolean;
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
  tablePartsCount = 0;
  countries!: IGetCountriesDto[];
  activities!: IGetActivitiesDto[];
  selectedValue!: string;
  companyId!: string;
  formData!: IDataDto[];
  checkFormData: boolean = false;
  constructor(private route: ActivatedRoute, private authService: LoginService, private formServices: FormService, 
    private sharedServices: SharedService,private sectorsAndActivitiesServices: SectorAndActivitiesService) {


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
  onRadioChange(event: Event, value: string) {
    this.selectedValue = value;
  }

  GetTableById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          this.table = res.Data;
          this.tablePartsCount = this.table.tableParts.length;
          this.table.formContents.forEach((formContent: IGetQuestionDto) => {
            // Calculate the total number of parts (doubled)
            const totalPartsCount = this.tablePartsCount * 2;

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
  addSubCodeRow(code: ICode) {
    console.log(code)
    const subCode: ISubCodeForm = {
      arName: '',
      codeId: 0,
      enName: '',
      Id: 0,
      QuestionCode: '',
      subCodes: [],
      values: Array(this.tablePartsCount * 2).fill(0), // Initialize values array with 0s based on tablePartsCount,
      connectedWithId: 0,
      connectedWithLevel: 0,
      connectedWithType:'',
      IsTrueAndFalse : false,
      valueCheck:false

    }
    code.SubCodes.push(subCode);
  }
  removeSubCodeRow(code: ICode, subCode: ISubCode) {
    const index = code.SubCodes.indexOf(subCode);
    if (index > -1) {
      code.SubCodes.splice(index, 1);
    }
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
  onArCountryChange(subCode: any) {
    const selectedCountry = this.countries.find(country => country.arName === subCode.arCountry);
    if (selectedCountry) {
      subCode.enCountry = selectedCountry.enName;
    }
  }

  onEnCountryChange(subCode: any) {
    const selectedCountry = this.countries.find(country => country.enName === subCode.enCountry);
    if (selectedCountry) {
      subCode.arCountry = selectedCountry.arName;
    }
  }
  GetFormData() {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
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
              this.formData = res.Data[0].dataDtos;

              const storedCoverForm = localStorage.getItem(`coverForm${this.coverForm.id}`);
              if (storedCoverForm) {
                this.coverForm = JSON.parse(storedCoverForm);
              }
              tablesList.forEach((table: any) => {

                const tableIndex = this.coverForm.tables.findIndex(t => t.id == table.TableId);
                if (tableIndex !== -1) {
                  this.coverForm.tables[tableIndex].IsDisabled = table.items[0].IsDisabled;

                  if (this.coverForm.tables[tableIndex].Type == "1") {
                    this.coverForm.tables[tableIndex].formContents.forEach((formContent: any) => {
                      formContent.values = formContent.values || [0, 0, 0];
                      formContent.values[1] = formContent.values[1] || 0;
                      formContent.values[2] = 0; // Set transaction explicitly to 0 since it's derived
                      formContent.values[0] = formContent.values[2] || 0;

                      // If there are subCodes, ensure their values are also initialized
                      if (formContent.code.SubCodes) {
                        formContent.code.SubCodes.forEach((subCode: any) => {
                          // Initialize subCode `values` array if it doesn't exist
                          subCode.values = subCode.values || [0, 0, 0];

                          // Ensure the `values` array has the correct length and initial values
                          subCode.values[0] = subCode.values[0] || 0; // lastYear
                          subCode.values[2] = 0; // Set transaction explicitly to 0
                          subCode.values[1] = subCode.values[1] || 0; // nextYear
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
                        });
                      }
                    });
                  }
                  else if (this.coverForm.tables[tableIndex].Type == "6") {
                    this.coverForm.tables[tableIndex].formContents.forEach((formContent: any) => {
                      formContent.values = formContent.values || [0, 0,0];
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
                  else if (this.coverForm.tables[tableIndex].Type == "3") {
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
                          valueCheck: false
                        }
                        this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes.push(subCode)

                      }
                    }
                  }
                });
              });
              debugger
              localStorage.removeItem(`coverForm${this.coverForm.id}`);
              localStorage.setItem(`coverForm${this.coverForm.id}`, JSON.stringify(this.coverForm));
            }
          }
          else if (role === 'Admin' || role === 'Researchers') {
            debugger
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
  calculateTransaction(status: number) {

    if (status < 3)
      this.BeginningForm();
  }
  getSumOfValues(index: number): number {
    return this.table.formContents.reduce((sum, formContent) => {
      return sum + (formContent.values[index] || 0);
    }, 0);
  }
  changeStatus(status: number) {
    if (status < 3)
      this.BeginningForm();
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
}