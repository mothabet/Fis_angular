import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { IGetQuestionDto } from 'src/app/Forms/Dtos/QuestionDto';
import Swal from 'sweetalert2';
import { ICoverFormDetailsDto } from 'src/app/Forms/Dtos/FormDto';
import { IGetTableDto } from 'src/app/Forms/Dtos/TableDto';
import { NavigateTablesTypesService } from '../../services/navigate-tables-types.service';
import { IAddFormDataDto, IDataDto } from '../../Dtos/FormDataDto';

@Component({
  selector: 'app-navigate-tables-types',
  templateUrl: './navigate-tables-types.component.html',
  styleUrls: ['./navigate-tables-types.component.css']
})
export class NavigateTablesTypesComponent implements OnInit {
  @Input() coverForm!: ICoverFormDetailsDto;
  @Input() isCoverActive: boolean = false;
  @Input() isWorkDataActive: boolean = false;
  @Input() isCertificationActive: boolean = false;
  @Input() sharedTableType!: number;
  @Output() coverActivated: EventEmitter<void> = new EventEmitter();
  @Output() workDataActivated: EventEmitter<void> = new EventEmitter();
  @Output() certificationActivated: EventEmitter<void> = new EventEmitter();
  @Output() sharedType: EventEmitter<void> = new EventEmitter();
  Loader: boolean = false;
  tableType!: number;
  formId!: string;
  role: string = "";
  temp: string = "";
  companyId!: string;
  tableId: number | null = null;
  @Input() table!: IGetTableDto;
  formContents: any[] = [];
  constructor(private authService: LoginService, private activeRouter: ActivatedRoute,
    private sharedServices: SharedService, private formServices: FormService, private router: Router,
    private navigateTablesTypesService: NavigateTablesTypesService) { }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    const tableIdParam = this.activeRouter.snapshot.paramMap.get('tableId');
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);
    this.role = result.roles;
    this.tableId = tableIdParam ? +tableIdParam : null;
    this.GetFormById(this.formId ?? "0")
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
            navigationPromise = this.router.navigate(['/TransTable', this.formId, id, this.companyId]);
            break;
          case 2:
            navigationPromise = this.router.navigate(['/TableWithoutTrans', this.formId, id, this.companyId]);
            break;
          case 3:
            navigationPromise = this.router.navigate(['/TwoYearsWithParts', this.formId, id, this.companyId]);
            break;
          case 4:
            navigationPromise = this.router.navigate(['/OneYearWithParts', this.formId, id, this.companyId]);
            break;
          case 5:
            navigationPromise = this.router.navigate(['/PeriodTable', this.formId, id, this.companyId]);
            break;
          case 0:
            navigationPromise = this.router.navigate(['/QuarterTable', this.formId, id]);
            break;
          default:
            return;
        }
        this.displayFormContents();
        // navigationPromise.then(() => {
        //   window.location.reload();
        // }).catch((err) => {
        //   console.error('Navigation error:', err);
        // });
        this.Loader = false;

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
  displayFormContents() {
    if (this.table.Type == "1")
      this.addTableToListInLocalStorage(this.table);
    else if (this.table.Type == "2")
      this.addTableToListInLocalStorage(this.table);
    else if (this.table.Type == "3")
      this.addTableToListInLocalStorage(this.table);
    else if (this.table.Type == "4")
      this.addTableToListInLocalStorage(this.table);
    else if (this.table.Type == "5")
      this.addTableToListInLocalStorage(this.table);
  }
  addTableToListInLocalStorage(table: any): void {
    let storedTables = localStorage.getItem(`coverForm${this.coverForm.id}`);
    var coverForm!: ICoverFormDetailsDto
    if (storedTables) {
      coverForm = JSON.parse(storedTables);
      const tableIndex = coverForm.tables.findIndex(t => t.id === table.id);
      if (tableIndex !== -1) {
        coverForm.tables[tableIndex] = table;
      }
      localStorage.removeItem(`coverForm${this.coverForm.id}`);
    }

    localStorage.setItem(`coverForm${this.coverForm.id}`, JSON.stringify(coverForm));
  }
  removeTable(tableId: number): void {
    const storedTables = localStorage.getItem(`tablesList${this.coverForm.id}`);
    if (storedTables) {
      let tablesList: any[] = JSON.parse(storedTables);
      const tableIndex = tablesList.findIndex(t => t.id === tableId);
      if (tableIndex !== -1) {
        tablesList.splice(tableIndex, 1);
        localStorage.setItem(`tablesList${this.coverForm.id}`, JSON.stringify(tablesList));
      }
    }
  }
  SaveData(btnType: string) {
    this.Loader = true;
    this.displayFormContents();
    const storedTables = localStorage.getItem(`coverForm${this.coverForm.id}`);
    var coverForm!: ICoverFormDetailsDto
    if (storedTables) {
      coverForm = JSON.parse(storedTables);
    }
    var dataDtosList: IDataDto[] = [];
    for (let index = 0; index < coverForm.tables.length; index++) {
      for (let i = 0; i < coverForm.tables[index].formContents.length; i++) {
        var codesList: number[] = [];
        if (!(coverForm.tables[index].formContents[i].values == undefined)) {
          for (let j = 0; j < coverForm.tables[index].formContents[i].values.length; j++) {
            var codes = coverForm.tables[index].formContents[i].values[j];
            codesList.push(codes);
          }
          var dataDtos: IDataDto = {
            TableId: coverForm.tables[index].id,
            questionId: coverForm.tables[index].formContents[i].code.QuestionCode,
            codes: codesList,
            level: 1,
            codeId: coverForm.tables[index].formContents[i].code.Id,
            codeType: coverForm.tables[index].formContents[i].code.TypeId,
            valueCheck: coverForm.tables[index].formContents[i].valueCheck,
            parentCodeId: 0
          };
          dataDtosList.push(dataDtos);
          for (let r = 0; r < coverForm.tables[index].formContents[i].code.SubCodes.length; r++) {
            var codesListSub: number[] = [];
            for (let x = 0; x < coverForm.tables[index].formContents[i].code.SubCodes[r].values.length; x++) {
              var codes = coverForm.tables[index].formContents[i].code.SubCodes[r].values[x];
              codesListSub.push(codes);
            }
            var dataDtosSub: IDataDto = {
              TableId: coverForm.tables[index].id,
              questionId: coverForm.tables[index].formContents[i].code.SubCodes[r].QuestionCode,
              codes: codesListSub,
              level: 2,
              codeId: coverForm.tables[index].formContents[i].code.SubCodes[r].Id,
              codeType: 0,
              valueCheck: true,
              parentCodeId: coverForm.tables[index].formContents[i].code.Id
            };
            dataDtosList.push(dataDtosSub);
          }
        }
      }
    }
    var addFormDataDto: IAddFormDataDto = {
      dataDtos: dataDtosList,
      FormId: this.coverForm.id,
    };
    const observer = {
      next: (res: any) => {
        this.GetFormById(this.formId)
        this.Loader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 2000,
        });
        if (btnType === 'Approve')
          this.router.navigate(['/CompanyHome', 0]);
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.navigateTablesTypesService.AddFormData(addFormDataDto, btnType).subscribe(observer);

  }
  CompleteForm(): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
      ,
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.CompleteForm(+this.formId, +this.companyId).subscribe(observer);

  }
  CloseForm(): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.Loader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 2000,
        });
      }
      ,
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.CloseForm(+this.formId, +this.companyId).subscribe(observer);
  }
  GetFormById(id: string): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        debugger
        this.Loader = false;
        if (res.Data) {
          this.Loader = false;
          this.coverForm = res.Data;
          const storedTables = localStorage.getItem(`coverForm${this.coverForm.id}`);
          if (!storedTables) {
            localStorage.setItem(`coverForm${this.coverForm.id}`, JSON.stringify(this.coverForm));
            this.addTableToListInLocalStorage(this.table)
          }
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(+id, '', +this.companyId).subscribe(observer);
  }
}
