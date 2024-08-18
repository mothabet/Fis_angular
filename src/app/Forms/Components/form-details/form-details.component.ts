import { Component, OnInit } from '@angular/core';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICoverFormDetailsDto, IGetFormDto } from '../../Dtos/FormDto';
import { IGetTableDto } from '../../Dtos/TableDto';
import { IGetQuestionDto } from '../../Dtos/QuestionDto';

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
  type: string = '';
  table!: IGetTableDto;
  years!: number[];
  currentYear: number = 0;
  period: number = 0;
  formContent!: IGetQuestionDto[]
  isCoverActive = false;
  constructor(private formServices: FormService, private router: Router, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.type = this.activeRouter.snapshot.paramMap.get('type')!;
    this.isCoverActive = true
    this.GetFormById(+this.formId,this.type);
  }
  GetFormById(id: number , type:string): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          this.coverForm = res.Data;
          if (res.Data.tables.length > 0)
            this.noTables = false;
          this.Loader = false;
          console.log(this.coverForm)
        }
      },
      error: (err: any) => {

        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id,this.type).subscribe(observer);
  }
}
