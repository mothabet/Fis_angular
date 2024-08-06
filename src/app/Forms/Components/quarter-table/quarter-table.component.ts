import { Component, ElementRef, Renderer2 } from '@angular/core';
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

  constructor(private el: ElementRef,private renderer: Renderer2, private router: Router, private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {


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

  addNewRow() {
    
    // Find the tbody element
    const tableBody = this.el.nativeElement.querySelector('tbody');

    // Create a new row
    const newRow = this.renderer.createElement('tr');

    // Define the row content
    const cells = [
      this.createCell('New Row', 'text-start'),
      this.createCell('<input disabled class="quarter2" type="number" placeholder="0" />', 'text-center quarter2'),
      this.createCell('<input disabled class="quarter2" type="number" placeholder="0" />', 'text-center quarter2'),
      // Add more cells as needed
    ];

    // Append cells to the new row
    cells.forEach(cell => {
      this.renderer.appendChild(newRow, cell);
    });

    // Append the new row to the table body
    this.renderer.appendChild(tableBody, newRow);
  }

  private createCell(content: string, className: string) {
    const cell = this.renderer.createElement('td');
    this.renderer.addClass(cell, className);
    this.renderer.setProperty(cell, 'innerHTML', content);
    return cell;
  }
}
