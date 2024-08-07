import { Component, OnInit } from '@angular/core';
import { ICompany, IPdfDto } from '../../Dtos/CompanyHomeDto';
import { ActivatedRoute } from '@angular/router';
import { CompanyHomeService } from '../../services/companyHome.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-companies-details',
  templateUrl: './companies-details.component.html',
  styleUrls: ['./companies-details.component.css']
})
export class CompaniesDetailsComponent implements OnInit {
  showLoader: boolean = false;
  company!: ICompany;
  companyId!: string;
  selectedFiles: File[] = [];
  pdf!: IPdfDto;
  constructor(private activeRouter: ActivatedRoute, private companyServices: CompanyHomeService, private sharedServices: SharedService) {

  }
  ngOnInit(): void {
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.GetCompanyById(+this.companyId);
  }
  GetCompanyById(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        debugger
        if (res.Data) {
          this.company = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.companyServices.GetCompanyById(id).subscribe(observer);
  }

  onFilesSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
    this.onUpload();
  }
  triggerFileInput(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  onUpload(): void {
    if (this.selectedFiles.length > 0) {
      const formData: FormData = new FormData();

      this.showLoader = true;
      this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
      this.selectedFiles.forEach(file => {
        formData.append('fileDetails', file);
      });
      formData.append('pdfDto.companyId', this.companyId.toString());
      formData.append('pdfDto.arName', this.selectedFiles[0].name);
      formData.append('pdfDto.enName', this.selectedFiles[0].name);
      const observer = {
        next: (res: any) => {
          this.showLoader = false;
          Swal.fire({
            icon: 'success',
            title: 'تم رفع الملف',
            showConfirmButton: false,
            timer: 2000
          });
          const fileInput = document.getElementById('fileInput') as HTMLInputElement;
          fileInput.value = ''; // Clear the file input
        },
        error: (err: any) => {
          debugger
          this.sharedServices.handleError(err);
          this.showLoader = false;
        },
      };
      this.companyServices.uploadFile(formData).subscribe(observer);
    } else {
      console.warn('No file selected');
    }
  }

}
