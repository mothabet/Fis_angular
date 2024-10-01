import { Component, OnInit } from '@angular/core';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICoverFormDetailsDto, IGetFormDto } from '../../Dtos/FormDto';
import { IGetTableDto } from '../../Dtos/TableDto';
import { IGetQuestionDto } from '../../Dtos/QuestionDto';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-form-details',
  templateUrl: './form-details.component.html',
  styleUrls: ['./form-details.component.css']
})
export class FormDetailsComponent implements OnInit {
  Loader: boolean = false;
  noData: boolean = false;
  forms: IGetFormDto[] = [];
  coverForm!: ICoverFormDetailsDto;
  noTables = true;
  formId: string = '';
  companyId: string = '';
  type: string = '';
  table!: IGetTableDto;
  years!: number[];
  currentYear: number = 0;
  period: number = 0;
  formContent!: IGetQuestionDto[]
  isCoverActive = false;
  role:string = "";

  constructor(private authService: LoginService,private formServices: FormService, private router: Router, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.type = this.activeRouter.snapshot.paramMap.get('type')!;
    this.isCoverActive = true
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
  }
  
}
