import { Component, OnInit } from '@angular/core';
import { IGetTableFieldsDto, IReportFilterDto } from '../../Dtos/ReportDto';
import { SharedService } from 'src/app/shared/services/shared.service';
import { FormBuilder } from '@angular/forms';
import { ReportService } from '../../Services/report.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyHomeService } from 'src/app/companies/services/companyHome.service';
import { FormService } from 'src/app/Forms/Services/form.service';
import { ResearcherHomeService } from 'src/app/researcher/services/researcher-home.service';

@Component({
  selector: 'app-report-contents',
  templateUrl: './report-contents.component.html',
  styleUrls: ['./report-contents.component.css']
})
export class ReportContentsComponent implements OnInit {
  tableType: number = 0;
  tableFields: IGetTableFieldsDto[] = [];
  appendedTableFields: IGetTableFieldsDto[] = [];
  researchers: IReportFilterDto[] = [];
  appendedResearchers: IReportFilterDto[] = [];
  wilayat: IReportFilterDto[] = [];
  appendedWilayat: IReportFilterDto[] = [];
  governorates: IReportFilterDto[] = [];
  appendedGovernorates: IReportFilterDto[] = [];
  subActivities: IReportFilterDto[] = [];
  appendedSubActivities: IReportFilterDto[] = [];
  activities: IReportFilterDto[] = [];
  appendedActivities: IReportFilterDto[] = [];
  sectors: IReportFilterDto[] = [];
  appendedSectors: IReportFilterDto[] = [];
  showLoader: boolean = false;
  constructor(private sharedService: SharedService, private fb: FormBuilder,
    private toastr: ToastrService, private reportServices: ReportService,
    private companyHomeServices: CompanyHomeService, private formServices: FormService,
    private researcherService: ResearcherHomeService) {}
  ngOnInit(): void {
    this.GetWilayat();
    this.GetSectors();
    this.GetActivities();
    this.GetResearchers();
  }
  GetTableFields(event: any): void {
    if (this.tableType != 0) {
      this.showLoader = true;
      const observer = {
        next: (res: any) => {
          if (res.Data) {
            this.tableFields = res.Data;
          }
          this.showLoader = false;
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          this.showLoader = false;
        },
      };
      this.reportServices.GetTableFields(this.tableType).subscribe(observer);
    }
  }
  InsertField(event: any) {

    const selectedFieldName = event.target.value; // Get the selected field name

    // Check if the field is already added to prevent duplicates
    const fieldExists = this.appendedTableFields.some(field => field.name === selectedFieldName);

    if (!fieldExists) {
      const selectedField = this.tableFields.find(field => field.name === selectedFieldName);

      // Ensure selectedField is not undefined before adding to the array
      if (selectedField) {
        this.appendedTableFields.push(selectedField);
      }
    }
  }
  GetWilayat() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.wilayat = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
      },
    };
    this.companyHomeServices.GetWilayat().subscribe(observer);
  }
  InsertWilaya(event: any) {
    const selectedFieldName = event.target.value; // Get the selected field name

    // Check if the field is already added to prevent duplicates
    const fieldExists = this.appendedWilayat.some(field => field.arName === selectedFieldName);

    if (!fieldExists) {
      const selectedField = this.wilayat.find(field => field.arName === selectedFieldName);

      // Ensure selectedField is not undefined before adding to the array
      if (selectedField) {
        this.appendedWilayat.push(selectedField);
      }
    }
  }
  GetResearchers() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.researchers = res.Data.getResearcherDtos;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
      },
    };
    this.researcherService.GetAllReseachers(0).subscribe(observer);
  }
  InsertResearcher(event: any) {
    const selectedFieldName = event.target.value; // Get the selected field name

    // Check if the field is already added to prevent duplicates
    const fieldExists = this.appendedResearchers.some(field => field.arName === selectedFieldName);

    if (!fieldExists) {
      const selectedField = this.researchers.find(field => field.arName === selectedFieldName);

      // Ensure selectedField is not undefined before adding to the array
      if (selectedField) {
        this.appendedResearchers.push(selectedField);
      }
    }
  }
  GetGovernorates() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.wilayat = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
      },
    };
    this.companyHomeServices.GetWilayat().subscribe(observer);
  }
  InsertGovernorate(event: any) {
    const selectedFieldName = event.target.value; // Get the selected field name

    // Check if the field is already added to prevent duplicates
    const fieldExists = this.appendedWilayat.some(field => field.arName === selectedFieldName);

    if (!fieldExists) {
      const selectedField = this.wilayat.find(field => field.arName === selectedFieldName);

      // Ensure selectedField is not undefined before adding to the array
      if (selectedField) {
        this.appendedWilayat.push(selectedField);
      }
    }
  }
  GetSubActivities() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.wilayat = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
      },
    };
    this.companyHomeServices.GetWilayat().subscribe(observer);
  }
  InsertSubActivity(event: any) {
    const selectedFieldName = event.target.value; // Get the selected field name

    // Check if the field is already added to prevent duplicates
    const fieldExists = this.appendedWilayat.some(field => field.arName === selectedFieldName);

    if (!fieldExists) {
      const selectedField = this.wilayat.find(field => field.arName === selectedFieldName);

      // Ensure selectedField is not undefined before adding to the array
      if (selectedField) {
        this.appendedWilayat.push(selectedField);
      }
    }
  }
  GetActivities() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.activities = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
      },
    };
    this.formServices.GetActivities().subscribe(observer);
  }
  InsertActivity(event: any) {
    const selectedFieldName = event.target.value; // Get the selected field name

    // Check if the field is already added to prevent duplicates
    const fieldExists = this.appendedActivities.some(field => field.arName === selectedFieldName);

    if (!fieldExists) {
      const selectedField = this.activities.find(field => field.arName === selectedFieldName);

      // Ensure selectedField is not undefined before adding to the array
      if (selectedField) {
        this.appendedActivities.push(selectedField);
      }
    }
  }
  GetSectors() {
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.sectors = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
      },
    };
    this.companyHomeServices.GetSectors().subscribe(observer);
  }
  InserSector(event: any) {
    const selectedFieldName = event.target.value; // Get the selected field name

    // Check if the field is already added to prevent duplicates
    const fieldExists = this.appendedSectors.some(field => field.arName === selectedFieldName);

    if (!fieldExists) {
      const selectedField = this.sectors.find(field => field.arName === selectedFieldName);

      // Ensure selectedField is not undefined before adding to the array
      if (selectedField) {
        this.appendedSectors.push(selectedField);
      }
    }
  }
}
