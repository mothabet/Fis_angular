import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-navigate-tables-types',
  templateUrl: './navigate-tables-types.component.html',
  styleUrls: ['./navigate-tables-types.component.css']
})
export class NavigateTablesTypesComponent implements OnInit {
  @Input() coverForm: any;
  @Input() isCoverActive: boolean = false;
  @Output() coverActivated: EventEmitter<void> = new EventEmitter();
  Loader: boolean = false;
  tableType!: number;
  formId!: string;
  tableId: number | null = null; 
  constructor(private activeRouter: ActivatedRoute, private sharedServices: SharedService, private formServices: FormService, private router: Router) { }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    const tableIdParam = this.activeRouter.snapshot.paramMap.get('tableId');
    this.tableId = tableIdParam ? +tableIdParam : null;  }
  TablesNavigation(id: number) {
    this.GetTableById(id);
  }
  GetTableById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        this.tableType = res.Data.Type;
        this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
        if (this.tableType == 1)
          this.router.navigate(['/TransTable', this.formId, id]);
        else if (this.tableType == 2)
          this.router.navigate(['/TableWithoutTrans', this.formId, id]);
        else if (this.tableType == 3)
          this.router.navigate(['/TwoYearsWithParts', this.formId, id]);
        else if (this.tableType == 4)
          this.router.navigate(['/OneYearWithParts', this.formId, id]);
        else if (this.tableType == 5)
          this.router.navigate(['/PeriodTable', this.formId, id]);
        if (res.Data) {
          this.Loader = false;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetTableById(id).subscribe(observer);
  }
  activateCover() {
    this.coverActivated.emit();
    this.tableId = null;
  }
}
