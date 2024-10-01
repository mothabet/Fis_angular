import { Component } from '@angular/core';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IGetTableDto } from '../../Dtos/TableDto';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto } from '../../Dtos/FormDto';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-two-years-with-parts',
  templateUrl: './two-years-with-parts.component.html',
  styleUrls: ['./two-years-with-parts.component.css']
})
export class TwoYearsWithPartsComponent {
  Loader: boolean = false;
  formId: string = '';
  tableId: string = '';
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
  tablePartsCount = 0;
  countries!: IGetCountriesDto[];
  activities!: IGetActivitiesDto[];
  selectedValue!: string;
  role:string = "";

  constructor(private authService: LoginService,private router: Router, private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {


  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.tableId = this.activeRouter.snapshot.paramMap.get('tableId')!;
    this.GetTableById(+this.tableId);
    this.GetFormById(+this.formId);
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
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
          this.Loader = false;
          this.table = res.Data;
          this.tablePartsCount = this.table.tableParts.length
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
    this.formServices.GetFormById(id).subscribe(observer);
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
  removeSubCodeRow(code: ICode, subCode: ISubCode) {
    const index = code.SubCodes.indexOf(subCode);
    if (index > -1) {
      code.SubCodes.splice(index, 1);
    }
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
