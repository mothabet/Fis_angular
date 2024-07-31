import { Component, OnInit } from '@angular/core';
import { FormService } from '../../Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-details',
  templateUrl: './form-details.component.html',
  styleUrls: ['./form-details.component.css']
})
export class FormDetailsComponent implements OnInit {

  constructor(private formServices: FormService, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {
    this.coverForm = {
      id: 0,
      tables: []
    };
  }
  Loader: boolean = false;
  noData: boolean = false;
  forms: IGetFormDto[] = [];
  coverForm!: ICoverFormDetailsDto;

  formId: string = '';
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('id')!;
    this.GetAllForms()
    this.GetFormById(+this.formId);
  }
  GetAllForms(type: string = ''): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        debugger
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
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        debugger
        if (res.Data) {
          this.coverForm.id = res.Data.id;
          this.coverForm.tables = res.Data.tables;
          this.Loader = false;
        }
      },
      error: (err: any) => {
        debugger
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id).subscribe(observer);
  }
}
