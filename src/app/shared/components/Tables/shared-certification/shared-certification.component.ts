import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICoverFormDetailsDto } from 'src/app/Forms/Dtos/FormDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-shared-certification',
  templateUrl: './shared-certification.component.html',
  styleUrls: ['./shared-certification.component.css']
})
export class SharedCertificationComponent {
  coverForm!: ICoverFormDetailsDto;
  Loader: boolean = false;
  @Input() formId!: string;
  isCertificationActive:boolean = false;
  constructor(private formServices: FormService,private sharedServices: SharedService, private activeRouter: ActivatedRoute) {

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
