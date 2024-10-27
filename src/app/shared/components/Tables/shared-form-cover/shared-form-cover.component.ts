import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { IAuditRule } from 'src/app/auditing-rules/Dtos/CodeHomeDto';
import { AuditRuleHomeService } from 'src/app/auditing-rules/Services/audit-rule-home.service';
import { LoginService } from 'src/app/auth/services/login.service';
import { ISubCodeForm } from 'src/app/code/Dtos/SubCodeHomeDto';
import { ICompany } from 'src/app/companies/Dtos/CompanyHomeDto';
import { IDropdownList } from 'src/app/companies/Dtos/SharedDto';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { ICertificationDto, ICoverFormDetailsDto, IGetFormDto, IQuarterCoverFormDataDto } from 'src/app/Forms/Dtos/FormDto';
import { IGetQuestionDto } from 'src/app/Forms/Dtos/QuestionDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { IGeneralDataDto, IWorkDataChkDto, IWorkDataQuesDto } from 'src/app/Forms/Dtos/WorkDataDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ICoverFormData, IDataDto } from 'src/app/shared/Dtos/FormDataDto';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-shared-form-cover',
  templateUrl: './shared-form-cover.component.html',
  styleUrls: ['./shared-form-cover.component.css']
})
export class SharedFormCoverComponent implements OnInit {
  coverForm: ICoverFormDetailsDto = {
    id: 0,
    typeQuarter: 0,
    tables: [],
    arName: '',
    enName: '',
    arNotes: '',
    enNotes: '',
    reviewYear: '',
    status: 0,
    quarterCoverData: {} as IQuarterCoverFormDataDto,  // Initialize with an empty object or default values
    coverFormData: {} as ICoverFormData,              // Same here
    certification: {} as ICertificationDto,           // And here
    codeActivity: '',
    codeActivityName: '',
    GeneralData: {} as IGeneralDataDto,               // Initialize GeneralData
    Type: 0
  };
  workData: IWorkDataQuesDto[] = [
    { arName: 'اسم  المنشأة : ', enName: ' :  Name of  Enterprise', inputValue: '' },
    { arName: 'رقم السجل التجارى : ', enName: ' :  Commercial Registration No', inputValue: '' },
    { arName: 'رقم الترخيص البلدي : ', enName: ' :  Municipality Number', inputValue: '' },
    { arName: 'النشاط الاقتصادى الرئيسى : ', enName: ' :  Main Economic Activity', inputValue: '' },
    { arName: 'النشاط الثانوى : ', enName: ' :  Secondary Activity', inputValue: '' },
    { arName: 'عنوان المنشاة : ', enName: ' :  Address and Location', inputValue: '' },
    { arName: 'المحافظة : ', enName: ' :  Region', inputValue: '' },
    { arName: 'الولاية : ', enName: ' :  Wilayat', inputValue: '' },
    { arName: 'رقم صندوق البريد : ', enName: ' :  P.O.Box', inputValue: '' },
    { arName: 'الرمز البريدى : ', enName: ' :  Postal Code', inputValue: '' },
    { arName: 'رقم الهاتف : ', enName: ' :  Telephone No', inputValue: '' },
    { arName: 'رقم الفاكس : ', enName: ' :  Fax No', inputValue: '' },
    { arName: 'البريد الالكترونى : ', enName: ' :  Email', inputValue: '' },
    { arName: 'الموقع الإلكتروني : ', enName: ' :  Website', inputValue: '' },
  ];
  workDataChk: IWorkDataChkDto[] = [
    { arName: 'منشاة فردية', enName: 'Sole Proprietorship', selected: false },
    { arName: 'تضامنية', enName: 'Simple Partnership', selected: false },
    { arName: 'توصية', enName: 'Limited Partnership', selected: false },
    { arName: 'محاصة', enName: 'Shared Limited Partnership', selected: false },
    { arName: 'مساهمة ( عامه او مقفله )', enName: 'Joint Stock (Public or closed)', selected: false },
    { arName: 'محدودة المسؤولية', enName: 'Limited Liability', selected: false },
    { arName: 'فرع شركة اجنبية', enName: 'Branch of Foreign Enterprise', selected: false },
    { arName: 'أخرى (حدد)', enName: 'Other (specify)', selected: false }
  ];
  generalDataDto: IGeneralDataDto = {
    ChekInfo: 0,
    CompanyInfo: this.workData,
    from: '',
    to: '',
    describeMainActivity: '',
    dataSource : 0
  };
  company!: ICompany;
  Loader: boolean = false;
  noData: boolean = false;
  forms: IGetFormDto[] = [];
  noTables = true;
  @Input() formId!: string;
  @Input() companyId!: string;
  @Input() tableId!: string;
  table!: IGetTableDto;
  years!: number[];
  currentYear: number = 0;
  period: number = 0;
  formContent!: IGetQuestionDto[]
  isCoverActive = false;
  sharedTableType!: number;
  coverFormData!: ICoverFormData;
  formData!: IDataDto[];
  auditRules: IAuditRule[] = [];
  Governorates: IDropdownList[] = []
  Wilayat: IDropdownList[] = []

  constructor(private authService: LoginService, private companyServices: CompanyHomeService, private formServices: FormService,
    private auditRuleHomeService: AuditRuleHomeService, private companyHomeServices: CompanyHomeService
    , private sharedService: SharedService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.isCoverActive = true
    this.GetFormById(+this.formId)
  }
  GetFormById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          
          this.coverForm = {
            ...this.coverForm,  // Spread the current values of coverForm to preserve them
            ...res.Data,        // Overwrite only the properties from res.Data
            GeneralData: res.Data.GeneralData || this.coverForm.GeneralData, // Preserve GeneralData if not provided
          };
          this.GetFormData();
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id, '', +this.companyId).subscribe(observer);
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
                    const parsedCoverForm = JSON.parse(storedCoverForm);

                    this.coverForm = {
                      ...this.coverForm,     // Spread the current default values of coverForm
                      ...parsedCoverForm,    // Overwrite with the parsed values
                      GeneralData: parsedCoverForm.GeneralData || this.coverForm.GeneralData,  // Preserve GeneralData if not provided
                    };
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
                              IsTransaction: false,
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
                                IsTransaction: false,
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
                  let generalData = localStorage.getItem(`generalData`);
                  if (generalData) {
                    this.coverForm.GeneralData = JSON.parse(generalData) as IGeneralDataDto;
                    this.workData = this.coverForm.GeneralData.CompanyInfo;
                  }
                  else if (res.Data.length > 0) {
                    if (res.Data[0].GeneralData) {
                      this.coverForm.GeneralData = JSON.parse(res.Data[0].GeneralData);
                      this.workData = this.coverForm.GeneralData.CompanyInfo;
                    }
                  }
                }
                else {
                  this.GetCompanyById(+this.companyId);
                }
              }
              else if (role === 'Admin' || role === 'Researchers') {

                localStorage.removeItem(`coverForm${this.coverForm.id}`);
                // this.modifyInputById(this.coverForm.typeQuarter);
                return;
              }
              const storedCoverForm = localStorage.getItem(`coverForm${this.coverForm.id}`);
              if (storedCoverForm) {
                const parsedCoverForm = JSON.parse(storedCoverForm);

                this.coverForm = {
                  ...this.coverForm,     // Spread the current default values of coverForm
                  ...parsedCoverForm,    // Overwrite with the parsed values
                  GeneralData: parsedCoverForm.GeneralData || this.coverForm.GeneralData,  // Preserve GeneralData if not provided
                };
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
  ngOnDestroy() {

    let coverFormData = localStorage.getItem(`coverFormData`);
    if (coverFormData) {
      localStorage.removeItem(`coverFormData`);
    }
    localStorage.setItem(`coverFormData`, JSON.stringify(this.coverForm.coverFormData));
  }
  GetCompanyById(id: number) {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.company = res.Data;
          this.workData.forEach((item) => {
            if (item.arName.includes('اسم  المنشأة : ')) {
              item.inputValue = this.company.arName;
            }
            else if (item.arName.includes('الموقع الإلكتروني : ')) {

              item.inputValue = this.company.webSite;
            }
            else if (item.arName.includes('رقم الفاكس : ')) {

              item.inputValue = this.company.fax;
            }
            else if (item.arName.includes('البريد الالكترونى : ')) {

              item.inputValue = this.company.email;
            }
            else if (item.arName.includes('رقم الهاتف : ')) {

              item.inputValue = this.company.phoneNumber;
            }
            else if (item.arName.includes('الرمز البريدى : ')) {

              item.inputValue = this.company.postalCode;
            }
            else if (item.arName.includes('رقم صندوق البريد : ')) {

              item.inputValue = this.company.mailBox;
            }
            else if (item.arName.includes('الولاية : ')) {

              item.inputValue = this.company.wilayat;
            }
            else if (item.arName.includes('المنطقة : ')) {

              item.inputValue = this.company.governorates;
            }
            else if (item.arName.includes('عنوان المنشاة : ')) {

              item.inputValue = this.company.address;
            }
            else if (item.arName.includes('النشاط الثانوى : ')) {

              item.inputValue = this.company.subActivity;
            }
            else if (item.arName.includes('النشاط الاقتصادى الرئيسى : ')) {

              item.inputValue = this.company.activity;
            }
            else if (item.arName.includes('رقم الترخيص البلدي : ')) {

              item.inputValue = this.company.compRegNumber;
            }
            else if (item.arName.includes('رقم السجل التجارى : ')) {

              item.inputValue = this.company.compRegNumber;
            }
          });
          
          let generalData = localStorage.getItem(`generalData`);
          if (generalData) {
            this.coverForm.GeneralData = JSON.parse(generalData) as IGeneralDataDto;
            this.workData = this.coverForm.GeneralData.CompanyInfo;
          }
          else {
            this.coverForm.GeneralData = this.generalDataDto;
            this.coverForm.GeneralData.CompanyInfo = this.workData as IWorkDataQuesDto[];
            localStorage.setItem(`generalData`, JSON.stringify(this.coverForm.GeneralData));
          }
        }
        this.Loader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.companyServices.GetCompanyById(id).subscribe(observer);
  }
  GetWilayat(govId: number) {
    if (govId > 0) {
      const observer = {
        next: (res: any) => {
          if (res.Data) {
            this.Wilayat = res.Data;
          }
          this.GetGovernorates();
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
        },
      };
      this.companyHomeServices.GetWilayat(govId).subscribe(observer);
    }
  }
  GetGovernorates() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.Governorates = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
      },
    };
    this.companyHomeServices.GetGovernorates().subscribe(observer);
  }
}