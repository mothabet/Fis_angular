import { Component } from '@angular/core';
import { IGetQuestionDto } from '../../Dtos/QuestionDto';
import { ICoverFormDetailsDto, IGetFormDto, IGetTablesDto } from '../../Dtos/FormDto';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IGetTableDto } from '../../Dtos/TableDto';

@Component({
  selector: 'app-one-year-with-parts',
  templateUrl: './one-year-with-parts.component.html',
  styleUrls: ['./one-year-with-parts.component.css']
})
export class OneYearWithPartsComponent {
  Loader: boolean = false;
  formId: string = '';
  tableId: string = '';
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
  tablePartsCount = 0;

  constructor(private router: Router, private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {
    
    
  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.tableId = this.activeRouter.snapshot.paramMap.get('tableId')!;
    this.GetTableById(+this.tableId);
    this.GetFormById(+this.formId);
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
          console.log(this.table)
          this.tablePartsCount = this.table.tableParts.length
          console.log(this.tablePartsCount)
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
          debugger
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
}
