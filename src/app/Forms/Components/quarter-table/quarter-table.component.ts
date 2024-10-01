import { Component, Input, Renderer2 } from '@angular/core';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto } from '../../Dtos/FormDto';
import { IGetTableDto } from '../../Dtos/TableDto';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IGetQuestionDto } from '../../Dtos/QuestionDto';
import { ICode } from 'src/app/code/Dtos/CodeHomeDto';
import { ISubCode } from 'src/app/code/Dtos/SubCodeHomeDto';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-quarter-table',
  templateUrl: './quarter-table.component.html',
  styleUrls: ['./quarter-table.component.css']
})
export class QuarterTableComponent {
  Loader: boolean = false;
  @Input() formId!: string;
  @Input() tableId!: string;
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
  tablePartsCount = 0;
  countries! : IGetCountriesDto[];
  activities! : IGetActivitiesDto[];
  role:string = "";
  constructor(private authService: LoginService,private renderer: Renderer2, private router: Router, private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {


  }
  ngOnInit(): void {
    
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.tableId = this.activeRouter.snapshot.paramMap.get('tableId')!;
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
  }
  
}
