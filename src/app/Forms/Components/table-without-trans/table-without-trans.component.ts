import { Component } from '@angular/core';
import { IGetQuestionDto } from '../../Dtos/QuestionDto';
import { ICoverFormDetailsDto, IGetFormDto, IGetTablesDto } from '../../Dtos/FormDto';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IGetTableDto } from '../../Dtos/TableDto';

@Component({
  selector: 'app-table-without-trans',
  templateUrl: './table-without-trans.component.html',
  styleUrls: ['./table-without-trans.component.css']
})

export class TableWithoutTransComponent {
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
