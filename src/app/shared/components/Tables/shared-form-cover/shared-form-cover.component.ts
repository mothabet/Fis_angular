import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICoverFormDetailsDto, IGetFormDto } from 'src/app/Forms/Dtos/FormDto';
import { IGetQuestionDto } from 'src/app/Forms/Dtos/QuestionDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-shared-form-cover',
  templateUrl: './shared-form-cover.component.html',
  styleUrls: ['./shared-form-cover.component.css']
})
export class SharedFormCoverComponent implements OnInit{
  Loader: boolean = false;
  noData: boolean = false;
  forms: IGetFormDto[] = [];
  coverForm!: ICoverFormDetailsDto;
  noTables = true;
  @Input() formId!: string;
  @Input() companyId!: string;
  table!: IGetTableDto;
  years!: number[];
  currentYear: number = 0;
  period: number = 0;
  formContent!: IGetQuestionDto[]
  isCoverActive = false;
  sharedTableType!:number;
  constructor(private formServices: FormService, private router: Router, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.isCoverActive = true
    this.GetFormById(+this.formId)
  }
  ngAfterViewInit(): void {
    ; // Call method after view is initialized
  }
  GetFormById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        if (res.Data) {
          
          this.coverForm = res.Data;
          if (res.Data.tables.length > 0)
            this.noTables = false;
          this.Loader = false;
        }
      },
      error: (err: any) => {

        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id,'',+this.companyId).subscribe(observer);
  }
}
