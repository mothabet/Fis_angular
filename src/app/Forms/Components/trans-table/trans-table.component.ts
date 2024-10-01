import { Component } from '@angular/core';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IGetTableDto } from '../../Dtos/TableDto';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto, IGetFormDto } from '../../Dtos/FormDto';
import { inputs } from '@syncfusion/ej2-angular-diagrams/src/diagram/diagram.component';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-trans-table',
  templateUrl: './trans-table.component.html',
  styleUrls: ['./trans-table.component.css']
})
export class TransTableComponent {
  Loader: boolean = false;
  formId: string = '';
  tableId: string = '';
  isChecked!: boolean;
  table!: IGetTableDto;
  form!:IGetFormDto;
  lastYear = 0;
  nextYear = 0;
  transaction = 0;
  countries! : IGetCountriesDto[];
  activities! : IGetActivitiesDto[];
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
  GetTableById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        debugger
        this.Loader = false;
        if (res.Data) {
          this.Loader = false;
          this.table = res.Data;
          console.log(this.table);
        }
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
          this.form = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id).subscribe(observer);
  }
  calculateTransaction() {
    this.transaction = this.lastYear - this.nextYear;
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


