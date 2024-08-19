import { Component, Input } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto } from 'src/app/Forms/Dtos/FormDto';
import { IDataDto } from 'src/app/shared/Dtos/FormDataDto';
@Component({
  selector: 'app-shared-table-without-trans',
  templateUrl: './shared-table-without-trans.component.html',
  styleUrls: ['./shared-table-without-trans.component.css']
})
export class SharedTableWithoutTransComponent {
  Loader: boolean = false;
  @Input() formId!: string;
  @Input() tableId!: string;
  isChecked!: boolean;
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
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

      // Sequentially await each method to ensure proper execution order
      const storedTables = localStorage.getItem(`tablesList${this.formId}`);
      if (storedTables) {
        let tablesList: any[] = [];
        tablesList = JSON.parse(storedTables);
        const tableIndex = tablesList.findIndex(t => t.id == this.tableId);
        if (tableIndex !== -1) { // Ensure that the table is found
          this.table = tablesList[tableIndex]; // Retrieve the entire table object
        }
        else
          this.GetTableById(+this.tableId);
      }
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
          this.Loader = false;
          debugger
          this.table = res.Data;
          this.table.formContents.forEach((formContent: any) => {
            formContent.values = formContent.values || [0, 0];
            formContent.values[1] = formContent.values[1] || 0;
            formContent.values[0] = formContent.values[2] || 0;

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
        this.GetFormData();
      },
      error: (err: any) => {
        debugger
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
    this.formServices.GetFormById(id, '', +this.companyId).subscribe(observer);
  }
  addSubCodeRow(code: ICode) {
    debugger
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
    debugger
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
        debugger
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
  GetFormData() {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        debugger
        if (res.Data) {
          if (!(res.Data.length > 0)) {
            this.checkFormData = false;
            const storedTables = localStorage.getItem(`tablesList${this.formId}`);
          if (storedTables) {
            let tablesList: any[] = [];
            tablesList = JSON.parse(storedTables);
            const tableIndex = tablesList.findIndex(t => t.id == this.tableId);
            if (tableIndex !== -1) { // Ensure that the table is found
              this.table = tablesList[tableIndex]; // Retrieve the entire table object
            }
          }
          this.Loader = false;
            return;
          }
          this.checkFormData = true;
          this.formData = res.Data[0].dataDtos;
  
          // Iterate over each form content and map the data accordingly
          this.table.formContents.forEach((formContent, index) => {
            // Loop through each item in formData
            this.formData.forEach(dataDto => {
              if (dataDto.level == 1 && formContent.code.QuestionCode == dataDto.questionId) {
                // If it's level 1, assign to formContent values
                formContent.values = dataDto.codes.slice(0, 3);
              } else if (dataDto.level === 2) {
                // If it's level 2, find the corresponding subCode
                formContent.code.SubCodes.forEach((subCode, subIndex) => {
                  // Check if the QuestionCode matches
                  if (subCode.QuestionCode == dataDto.questionId) {
                    subCode.values = dataDto.codes.slice(0, 3);
                  }
                });
              }
            });
          });
          
        }
        const storedTables = localStorage.getItem(`tablesList${this.formId}`);
          if (storedTables) {
            let tablesList: any[] = [];
            tablesList = JSON.parse(storedTables);
            const tableIndex = tablesList.findIndex(t => t.id == this.tableId);
            if (tableIndex !== -1) { // Ensure that the table is found
              this.table = tablesList[tableIndex]; // Retrieve the entire table object
            }
          }
          this.Loader = false;

      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormData(+this.formId, +this.companyId, +this.tableId).subscribe(observer);
  }
}
