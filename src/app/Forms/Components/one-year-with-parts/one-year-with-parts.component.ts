import { Component } from '@angular/core';
import { IGetQuestionDto } from '../../Dtos/QuestionDto';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto, IGetFormDto, IGetTablesDto } from '../../Dtos/FormDto';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IGetTableDto } from '../../Dtos/TableDto';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-one-year-with-parts',
  templateUrl: './one-year-with-parts.component.html',
  styleUrls: ['./one-year-with-parts.component.css']
})
export class OneYearWithPartsComponent {
  Loader: boolean = false;
  isChecked!: boolean;
  formId: string = '';
  tableId: string = '';
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
  tablePartsCount = 0;
  countries! : IGetCountriesDto[];
  activities! : IGetActivitiesDto[];
  role:string = "";
  constructor(private authService: LoginService,private router: Router, private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.tableId = this.activeRouter.snapshot.paramMap.get('tableId')!;
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
  }
}
