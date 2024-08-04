import { Component, OnInit } from '@angular/core';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICoverFormDetailsDto, IGetFormDto } from '../../Dtos/FormDto';
import { IGetTableDto } from '../../Dtos/TableDto';
import { IGetQuestionDto } from '../../Dtos/QuestionDto';

@Component({
  selector: 'app-form-details',
  templateUrl: './form-details.component.html',
  styleUrls: ['./form-details.component.css']
})
export class FormDetailsComponent implements OnInit {
  Loader: boolean = false;
  noData: boolean = false;
  forms: IGetFormDto[] = [];
  coverForm!: ICoverFormDetailsDto;
  noTables = true;
  formId: string = '';
  table!: IGetTableDto;
  years!: number[];
  currentYear: number = 0;
  period: number = 0;
  formContent!: IGetQuestionDto[]
  constructor(private formServices: FormService, private router: Router, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {
    this.coverForm = {
      id: 0,
      tables: [],
      arName: '',
      arNotes: '',
      enNotes: '',
    };
  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('id')!;
    debugger
    this.GetFormById(+this.formId);
  }

  GetAllForms(type: string = ''): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.forms = res.Data;

          if (this.forms.length > 0) {
            const element = document.getElementById('items');
            if (element) {
              element.classList.remove('d-none');
            }
          }
        }
        else {

        }
        this.Loader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetAllForms().subscribe(observer);
  }
  GetFormById(id: number): void {
    this.noTables = true;
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        debugger
        if (res.Data) {
          this.coverForm.id = res.Data.id;
          this.coverForm.tables = res.Data.tables;
          this.coverForm.arName = res.Data.arName;
          this.coverForm.arNotes = res.Data.arNotes;
          this.coverForm.enNotes = res.Data.enNotes;
          debugger
          if (res.Data.tables.length > 0)
            this.noTables = false;
          this.Loader = false;
        }
      },
      error: (err: any) => {

        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id).subscribe(observer);
  }
  FormsNavigation(id: number) {
    this.GetFormById(id);
    this.formId = id.toString();
  }
  GetTableById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        this.noData = !res.Data || res.Data.length === 0;
        if (res.Data) {
          this.table = res.Data;
          this.formContent = res.Data.formContents;
          console.log(this.formContent)
          this.period = res.Data.period;
          this.currentYear = new Date().getFullYear();
          this.years = Array.from({ length: this.period }, (_, i) => this.currentYear + i); // Adjust length for desired range

        }
        else {

        }
        this.Loader = false;
      },
      error: (err: any) => {
        debugger
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetTableById(id).subscribe(observer);
  }
  NavigateTables(id: number) {
    this.GetTableById(id);
    this.formId = this.activeRouter.snapshot.paramMap.get('id')!;
    if (this.table.Type == "1")
      this.router.navigate(['/TransTable', this.formId, id]);
    else
      this.router.navigate(['/PeriodTable', this.formId, id]);
  }
}
