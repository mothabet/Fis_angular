import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto, IGetFormDto } from 'src/app/Forms/Dtos/FormDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { IDataDto } from 'src/app/shared/Dtos/FormDataDto';
import { SharedService } from 'src/app/shared/services/shared.service';
@Component({
  selector: 'app-shared-trans-table',
  templateUrl: './shared-trans-table.component.html',
  styleUrls: ['./shared-trans-table.component.css']
})
export class SharedTransTableComponent {
  Loader: boolean = false;
  @Input() formId!: string;
  @Input() tableId!: string;
  isChecked!: boolean;
  table!: IGetTableDto;
  form!: ICoverFormDetailsDto;
  lastYear = 0;
  nextYear = 0;
  transaction = 0;
  countries!: IGetCountriesDto[];
  activities!: IGetActivitiesDto[];
  companyId!: string;
  formData!: IDataDto[];
  checkFormData: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router, private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {


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
  GetTableById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {

        this.Loader = false;
        if (res.Data) {
          debugger
          this.Loader = false;
          this.table = res.Data;
          this.table.formContents.forEach((formContent: any) => {
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
          this.GetFormData();
          const storedTables = localStorage.getItem(`tablesList${this.formId}`);
          if (storedTables) {
            let tablesList: any[] = [];
            tablesList = JSON.parse(storedTables);
            const tableIndex = tablesList.findIndex(t => t.id == this.tableId);
            if (tableIndex !== -1) { // Ensure that the table is found
              this.table = tablesList[tableIndex]; // Retrieve the entire table object
            }
          }

        }
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
          this.form = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id, '', +this.companyId).subscribe(observer);
  }
  calculateTransaction(item: any) {
    item.values[2] = item.values[1] - item.values[0];
  }
  addSubCodeRow(code: ICode) {
    const subCode: ISubCode = {
      arName: '',
      codeId: 0,
      enName: '',
      Id: 0,
      QuestionCode: '',
      subCodes: []
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

  GetFormData() {
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          debugger
          if (!(res.Data.length > 0)) {
            this.checkFormData = false;
            return;
          }
          this.checkFormData = true
          debugger
          this.formData = res.Data[0].dataDtos
          debugger
          this.table.formContents.forEach((formContent, index) => {
            const dataDto = this.formData.find(dto => dto.questionId == formContent.code.QuestionCode);
            debugger
            if (dataDto) {
              if (dataDto.level == 1)
                formContent.values = dataDto.codes.slice(0, 3);
              else if (dataDto.level == 2) {
                formContent.code.SubCodes.forEach((subCode, subIndex) => {
                  subIndex = index
                  const subCodeData = dataDto.codes[subIndex];
                  if (subCodeData) {
                    subCode.values = [subCodeData]; // You can adjust this based on your needs
                  }
                });
              }
            }
          });
        }
      },
      error: (err: any) => {

        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormData(+this.formId, +this.companyId, +this.tableId).subscribe(observer);
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
}
