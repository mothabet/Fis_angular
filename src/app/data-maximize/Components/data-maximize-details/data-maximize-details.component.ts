import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MaximizeService } from '../../Services/maximize.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-data-maximize-details',
  templateUrl: './data-maximize-details.component.html',
  styleUrls: ['./data-maximize-details.component.css']
})
export class DataMaximizeDetailsComponent implements OnInit {
  showLoader: boolean = false;
  noData: boolean = false;
  id: number = 0;
  type: number = 0;
  dataMaximizeDetails: any = {};
  constructor(private sharedService: SharedService, private fb: FormBuilder,
    private toastr: ToastrService, private dataMaximizeServices: MaximizeService,
    private activeRouter: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.id = +this.activeRouter.snapshot.paramMap.get('id')!;
    this.GetDataMaximizeDetails(1);
  }
  GetDataMaximizeDetails(type:number): void {
    this.showLoader = true;
    this.type = type;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          
          if(res.Data.dataMazimizeYearDtos[0].dataMaximizeDetailsItemsDtos && res.Data.dataMazimizeYearDtos[1].dataMaximizeDetailsItemsDtos){
            this.dataMaximizeDetails = res.Data;
            this.noData = false;
          }
          else{
            this.dataMaximizeDetails = res.Data;
            this.noData = true;
          }
        }
        else {
          this.noData = true
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.dataMaximizeServices.GetDataMaximizeDetails(this.id,type).subscribe(observer);
  }
}
