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
  dataMaximizeDetails: any = {};
  constructor(private sharedService: SharedService, private fb: FormBuilder,
    private toastr: ToastrService, private dataMaximizeServices: MaximizeService,
    private activeRouter: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.id = +this.activeRouter.snapshot.paramMap.get('id')!;
    this.GetDataMaximizeDetails(this.id);
  }
  GetDataMaximizeDetails(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          debugger
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
    this.dataMaximizeServices.GetDataMaximizeDetails(this.id).subscribe(observer);
  }
}
