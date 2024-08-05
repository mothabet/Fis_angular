import { Component } from '@angular/core';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IGetTableDto } from '../../Dtos/TableDto';
import { ICoverFormDetailsDto, IGetFormDto } from '../../Dtos/FormDto';
import { inputs } from '@syncfusion/ej2-angular-diagrams/src/diagram/diagram.component';

@Component({
  selector: 'app-trans-table',
  templateUrl: './trans-table.component.html',
  styleUrls: ['./trans-table.component.css']
})
export class TransTableComponent {
  Loader: boolean = false;
  formId: string = '';
  tableId: string = '';
  table!: IGetTableDto;
  form!:IGetFormDto;
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
          console.log(this.table);
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
          this.form = res.Data;
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


