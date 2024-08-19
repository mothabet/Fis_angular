import { Component, Input } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto } from 'src/app/Forms/Dtos/FormDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { IGetQuestionDto } from 'src/app/Forms/Dtos/QuestionDto';

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
          this.tablePartsCount = this.table.tableParts.length;
        }
        else
          this.GetTableById(+this.tableId);
      }
      this.GetFormById(+this.formId);
      this.GetActivites();
      this.GetCountrites();
    });
  }
  onRadioChange(event: Event, value: string) {
    this.selectedValue = value;
    // Handle additional logic if needed
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
    this.formServices.GetFormById(id, '', +this.companyId).subscribe(observer);
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
  removeSubCodeRow(code: ICode, subCode: ISubCode) {
    const index = code.SubCodes.indexOf(subCode);
    if (index > -1) {
      code.SubCodes.splice(index, 1);
    }
  }

  GetActivites() {
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          this.Loader = false;
          this.activities = res.Data;
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