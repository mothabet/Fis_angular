import { Component, OnInit } from '@angular/core';
import { ICoverFormDetailsDto } from '../../Dtos/FormDto';
import { FormService } from '../../Services/form.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-certification',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.css']
})
export class CertificationComponent implements OnInit{
  coverForm!: ICoverFormDetailsDto;
  Loader: boolean = false;
  formId: string = '';
  isCertificationActive:boolean = false;
  constructor(private formServices: FormService,private router: Router, private sharedServices: SharedService, private activeRouter: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.GetFormById(+this.formId);
    this.isCertificationActive = true;
  }
  GetFormById(id: number): void {
    this.Loader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.coverForm = res.Data;
        }
        this.Loader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.Loader = false;
      },
    };
    this.formServices.GetFormById(id).subscribe(observer);
  }
}