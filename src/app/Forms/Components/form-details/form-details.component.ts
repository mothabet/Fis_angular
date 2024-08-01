import { Component, OnInit } from '@angular/core';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ICoverFormDetailsDto, IGetFormDto } from '../../Dtos/FormDto';

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
  constructor(private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {
    this.coverForm = {
      id: 0,
      tables: [],
arName : '',
arNotes : '',
enNotes : '',
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
          if(res.Data.tables.length > 0)
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
  FormsNavigation(id: number){
    this.GetFormById(id);
    this.formId = id.toString();
  }
}
