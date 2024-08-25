import { Component, Input, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto } from 'src/app/Forms/Dtos/FormDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-shared-quarter-table',
  templateUrl: './shared-quarter-table.component.html',
  styleUrls: ['./shared-quarter-table.component.css']
})
export class SharedQuarterTableComponent {
  Loader: boolean = false;
  @Input() formId!: string;
  @Input() tableId!: string;
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
  tablePartsCount = 0;
  countries! : IGetCountriesDto[];
  activities! : IGetActivitiesDto[];
  companyId!:string;
  constructor(private route: ActivatedRoute,private renderer: Renderer2, private router: Router, private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {


  }
  ngOnInit(): void {
    
    this.route.paramMap.subscribe(params => {
      this.formId = params.get('formId')!;
      this.tableId = params.get('tableId')!;
      this.companyId = params.get('companyId')!;
      this.GetTableById(+this.tableId);
    this.GetFormById(+this.formId);
    this.GetActivites();
    this.GetCountrites();
    });
  }
  ngAfterViewInit(): void {
    this.modifyInputById(this.coverForm.typeQuarter); // Call method after view is initialized
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
          this.table = res.Data;
          this.table.formContents.forEach((formContent: any) => {
            formContent.values = formContent.values || [0, 0, 0];
            formContent.values[1] = formContent.values[1] || 0;
            // formContent.values[2] = 0; // Set transaction explicitly to 0 since it's derived
            // formContent.values[0] = formContent.values[2] || 0;

            // If there are subCodes, ensure their values are also initialized
            // if (formContent.code.SubCodes) {
            //   formContent.code.SubCodes.forEach((subCode: any) => {
            //     // Initialize subCode `values` array if it doesn't exist
            //     subCode.values = subCode.values || [0, 0, 0];

            //     // Ensure the `values` array has the correct length and initial values
            //     subCode.values[0] = subCode.values[0] || 0; // lastYear
            //     subCode.values[2] = 0; // Set transaction explicitly to 0
            //     subCode.values[1] = subCode.values[1] || 0; // nextYear
            //   });
            // }
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
        debugger
        if (res.Data) {
          this.Loader = false;
          this.coverForm = res.Data;
          this.modifyInputById(this.coverForm.typeQuarter);

        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id,'',+this.companyId).subscribe(observer);
  }
  modifyInputById(id: number): void {
    const inputs = document.getElementsByClassName('quarter' + id) as HTMLCollectionOf<HTMLInputElement>;
    const transactions = document.getElementsByClassName('transaction' + id) as HTMLCollectionOf<HTMLInputElement>;

    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      input.style.backgroundColor = 'rgb(202 227 224)';
      input.style.color = 'black';
      input.disabled = false;
    }
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      transaction.style.backgroundColor = 'rgb(202 227 224)';
      transaction.style.color = 'black';
      transaction.disabled = true;
    }
  }
  addSubCodeRow(code: ICode) {
    const subCode: ISubCode = {
      arName: '',
      codeId: 0,
      enName: '',
      Id: 0,
      QuestionCode: '',
      subCodes:[]
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
  inputChange(event:any){
    console.log(event);
  }
}
