import { Component, OnInit } from '@angular/core';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICoverFormDetailsDto, IGetFormDto } from '../../Dtos/FormDto';
import { IGetTableDto } from '../../Dtos/TableDto';
import { IGetQuestionDto } from '../../Dtos/QuestionDto';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-quarter-form-cover',
  templateUrl: './quarter-form-cover.component.html',
  styleUrls: ['./quarter-form-cover.component.css']
})
export class QuarterFormCoverComponent implements OnInit{
  formId: string = '';
  role:string = "";
  constructor(private authService: LoginService,private activeRouter: ActivatedRoute) {

  }
    ngOnInit(): void {
      this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
      const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
    }
}
