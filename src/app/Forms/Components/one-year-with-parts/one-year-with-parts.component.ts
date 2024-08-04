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
  
  constructor(private router: Router, private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {
    
    
  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.tableId = this.activeRouter.snapshot.paramMap.get('tableId')!;
  }
}
