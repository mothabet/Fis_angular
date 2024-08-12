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
  @Input() isWorkDataActive: boolean = false;
  @Input() isCertificationActive: boolean = false;
  @Output() coverActivated: EventEmitter<void> = new EventEmitter();
  @Output() workDataActivated: EventEmitter<void> = new EventEmitter();
  @Output() certificationActivated: EventEmitter<void> = new EventEmitter();
  Loader: boolean = false;
  tableType!: number;
  formId!: string;
  companyId!: string;
  tableId: number | null = null;
  constructor(private activeRouter: ActivatedRoute, private sharedServices: SharedService, private formServices: FormService, private router: Router) { }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    const tableIdParam = this.activeRouter.snapshot.paramMap.get('tableId');
    this.tableId = tableIdParam ? +tableIdParam : null;
  }
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
        let navigationPromise;

        switch (this.tableType) {
          case 1:
            navigationPromise = this.router.navigate(['/TransTable', this.formId, id]);
            break;
          case 2:
            navigationPromise = this.router.navigate(['/TableWithoutTrans', this.formId, id]);
            break;
          case 3:
            navigationPromise = this.router.navigate(['/TwoYearsWithParts', this.formId, id]);
            break;
          case 4:
            navigationPromise = this.router.navigate(['/OneYearWithParts', this.formId, id]);
            break;
          case 5:
            navigationPromise = this.router.navigate(['/PeriodTable', this.formId, id]);
            break;
          case 0:
            navigationPromise = this.router.navigate(['/QuarterTable', this.formId, id]);
            break;
          default:
            console.error('Unknown tableType');
            return;
        }
        if (res.Data) {
          this.Loader = false;
        }
        navigationPromise.then(() => {
          window.location.reload();
        }).catch((err) => {
          console.error('Navigation error:', err);
        });
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
  activateWorkData() {
    this.workDataActivated.emit();
    this.tableId = null;
  }
  certificationWorkData() {
    this.certificationActivated.emit();
    this.tableId = null;
  }
}
