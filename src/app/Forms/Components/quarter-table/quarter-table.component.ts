import { Component, Renderer2 } from '@angular/core';
import { ICoverFormDetailsDto } from '../../Dtos/FormDto';
import { IGetTableDto } from '../../Dtos/TableDto';
import { ActivatedRoute, Router } from '@angular/router';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-quarter-table',
  templateUrl: './quarter-table.component.html',
  styleUrls: ['./quarter-table.component.css']
})
export class QuarterTableComponent {
  Loader: boolean = false;
  formId: string = '';
  tableId: string = '';
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
  tablePartsCount = 0;

  constructor(private renderer: Renderer2, private router: Router, private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {


  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.tableId = this.activeRouter.snapshot.paramMap.get('tableId')!;
    this.GetTableById(+this.tableId);
    this.GetFormById(+this.formId);
    this.modifyInputById(this.coverForm.typeQuarter);
  }
  ngAfterViewInit(): void {
    debugger
    this.modifyInputById(this.coverForm.typeQuarter); // Call method after view is initialized
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
          this.tablePartsCount = this.table.tableParts.length
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
  modifyInputById(id:number): void {
    debugger
    const inputs = document.getElementsByClassName('quarter'+id) as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      input.style.backgroundColor = 'rgb(202 227 224)';
      input.style.color = 'black';
      input.disabled = false;
    }
  }

  
}