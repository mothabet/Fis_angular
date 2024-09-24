import { Component } from '@angular/core';
import { IGetTableDto } from '../../Dtos/TableDto';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto } from '../../Dtos/FormDto';
import { LoginService } from 'src/app/auth/services/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';

@Component({
  selector: 'app-table-percentage-without-trans',
  templateUrl: './table-percentage-without-trans.component.html',
  styleUrls: ['./table-percentage-without-trans.component.css']
})
export class TablePercentageWithoutTransComponent {
  Loader: boolean = false;
  formId: string = '';
  tableId: string = '';
  isChecked!: boolean;
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
  countries! : IGetCountriesDto[];
  activities! : IGetActivitiesDto[];
  role:string = "";

  constructor(private authService: LoginService, 
    private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {
    
    
  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.tableId = this.activeRouter.snapshot.paramMap.get('tableId')!;
    this.GetTableById(+this.tableId);
    this.GetFormById(+this.formId);
    this.GetActivites();
    this.GetCountrites();
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
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
  addSubCodeRow(code:ICode){
    const subCode:ISubCode={
      arName:'',
      codeId:0,
      enName:'',
      Id:0,
      QuestionCode:'',
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
}
