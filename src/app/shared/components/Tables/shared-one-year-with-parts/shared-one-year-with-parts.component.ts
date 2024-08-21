import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCode, ISubCodeForm } from 'src/app/code/Dtos/SubCodeHomeDto';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto } from 'src/app/Forms/Dtos/FormDto';
import { IGetQuestionDto } from 'src/app/Forms/Dtos/QuestionDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { IDataDto } from 'src/app/shared/Dtos/FormDataDto';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-shared-one-year-with-parts',
  templateUrl: './shared-one-year-with-parts.component.html',
  styleUrls: ['./shared-one-year-with-parts.component.css']
})
export class SharedOneYearWithPartsComponent {
  Loader: boolean = false;
  isChecked!: boolean;
  @Input() formId!: string;
  @Input() tableId!: string;
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
  tablePartsCount = 0;
  countries! : IGetCountriesDto[];
  activities! : IGetActivitiesDto[];
  companyId!:string;
  formData!: IDataDto[];
  checkFormData: boolean = false;
  constructor(private route: ActivatedRoute,private router: Router, private formServices: FormService, 
    private sharedServices: SharedService, private activeRouter: ActivatedRoute, private authService:LoginService) {
    
    
  }
  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.formId = params.get('formId')!;
      this.tableId = params.get('tableId')!;
      this.companyId = params.get('companyId')!;
      this.GetTableById(+this.tableId);
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
                this.table = res.Data;
                this.tablePartsCount = this.table.tableParts.length;
                // Initialize the `values` array for each formContent based on `tablePartsCount`
                this.table.formContents.forEach((formContent: IGetQuestionDto) => {
                    // Initialize the `values` array with zeroes, ensuring the first value is set to 0
                    formContent.values = [0, ...Array(this.tablePartsCount).fill(0)];
                    // Initialize the `values` array for each subCode
                    if (formContent.code.SubCodes) {
                        formContent.code.SubCodes.forEach((subCode: any) => {
                            // Set the first value to 0, and the rest based on the number of parts
                            subCode.values = [0, ...Array(this.tablePartsCount).fill(0)];
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
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id,'',+this.companyId).subscribe(observer);
  }
  addSubCodeRow(code:ICode){
    const subCode:ISubCodeForm={
      arName:'',
      codeId:0,
      enName:'',
      Id:0,
      QuestionCode:'',
      subCodes:[],
      values: Array(this.tablePartsCount*2).fill(0)
    }
    code.SubCodes.push(subCode);
  }
  GetActivites() {
    
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          this.Loader = false;
          this.activities = res.Data;
          console.log(this.activities)
        }
      },
      error: (err: any) => {
        
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetActivities().subscribe(observer);
  }
  GetCountrites() {
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          this.Loader = false;
          this.countries = res.Data;
          console.log(this.countries)
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetCountries().subscribe(observer);
  }
  calculateSum(values: number[]): number {
    return values.reduce((acc, val) => acc + (val || 0), 0);
  }
  GetFormData() {
    debugger
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        debugger
        const isLoggedIn = this.authService.getToken();
        if (isLoggedIn != "") {
          let res_ = this.authService.decodedToken(isLoggedIn);
          var role = res_.roles;
          debugger
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
                      this.coverForm.tables[tableIndex].formContents[level1ItemIndex].values = item.codes;
                    }
                  } else if (item.level == 2) {
                    // Find the corresponding level 1 item first
                    const level1ItemIndex = this.coverForm.tables[tableIndex].formContents.findIndex(fc => fc.codeId === item.parentCodeId);
                    if (level1ItemIndex !== -1) {
                      // Now find the correct subCode within the level 1 item's SubCodes
                      const subCodes = this.coverForm.tables[tableIndex].formContents[level1ItemIndex].code.SubCodes;
                      const subCodeIndex = subCodes.findIndex(subCode => subCode.Id === item.codeId);
                      if (subCodeIndex !== -1) {
                        subCodes[subCodeIndex].values = item.codes;
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
            localStorage.removeItem(`coverForm${this.coverForm.id}`);
            return;
          }
          debugger
          const storedCoverForm = localStorage.getItem(`coverForm${this.coverForm.id}`);
          if (storedCoverForm) {
            this.coverForm = JSON.parse(storedCoverForm);
          }

          const tableIndex = this.coverForm.tables.findIndex(t => t.id === +this.tableId);
          if (tableIndex !== -1 && this.coverForm.tables[tableIndex].formContents[0].values != undefined) {
            this.table = this.coverForm.tables[tableIndex];
          }
        }

        this.Loader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };

    this.formServices.GetFormData(+this.formId, +this.companyId, 0).subscribe(observer);
  }
}
