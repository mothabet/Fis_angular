import { Component, OnInit } from '@angular/core';
import { ICoverFormDetailsDto, IGetFormDto, IGetTablesDto } from '../../Dtos/FormDto';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IGetQuestionDto } from '../../Dtos/QuestionDto';
import { IGetTableDto } from '../../Dtos/TableDto';

@Component({
  selector: 'app-table-with-period',
  templateUrl: './table-with-period.component.html',
  styleUrls: ['./table-with-period.component.css']
})
export class TableWithPeriodComponent implements OnInit {
  Loader: boolean = false;
  formId: string = '';
  tableId: string = '';
  table!: IGetTableDto;
  constructor(private router: Router, private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {
    
    
  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.tableId = this.activeRouter.snapshot.paramMap.get('tableId')!;
  }
}
