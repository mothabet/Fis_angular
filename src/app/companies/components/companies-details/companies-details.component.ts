import { Component, OnInit } from '@angular/core';
import { ICompany, IGetPdfDto, IPdfDto } from '../../Dtos/CompanyHomeDto';
import { ActivatedRoute } from '@angular/router';
import { CompanyHomeService } from '../../services/companyHome.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

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
  companyPdfs!: IGetPdfDto[];
  constructor(private http: HttpClient,private activeRouter: ActivatedRoute, private companyServices: CompanyHomeService, private sharedServices: SharedService) {

  }
  ngOnInit(): void {
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.GetCompanyById(+this.companyId);
    this.GetCompanyPdfs(+this.companyId);
  }
  ngAfterViewInit(): void {
    
    this.showLoader = false;
  }
  GetCompanyById(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
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
          fileInput.value = '';
          this.GetCompanyPdfs(+this.companyId);
          this.showLoader = false;
        },
        error: (err: any) => {
          
          this.sharedServices.handleError(err);
          this.showLoader = false;
        },
      };
      this.companyServices.uploadFile(formData).subscribe(observer);
    } else {
      console.warn('No file selected');
    }
  }
  GetCompanyPdfs(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          
          this.companyPdfs = res.Data;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.companyServices.GetCompanyPdfs(id).subscribe(observer);
  }
  showAlert(id: number): void {
    Swal.fire({
      title: 'هل انت متأكد؟',
      text: 'لا يمكن التراجع عن هذا',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(46, 97, 158)',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم اريد المسح!',
      cancelButtonText: 'لا',
    }).then((result) => {
      if (result.isConfirmed) {
        this.DeletePdf(id);
      }
    });
  }
  DeletePdf(id: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.GetCompanyPdfs(+this.companyId);
        this.GetCompanyPdfs(+this.companyId)
        this.showLoader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 1500,
        });
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.companyServices.DeletePdf(id).subscribe(observer);
  }
  GetPdfPath(url: string): void {
    
    this.http.get(url, { responseType: 'blob' }).subscribe((blob: Blob) => {
      
      const fileName = url.substring(url.lastIndexOf('/') + 1);
      saveAs(blob, fileName);
    });
  }
  downloadPdf(path : string): void {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const pdfUrl = 'https://www.esu.edu/computing_communication_services/web-services/documents/23-24/fake.pdf';
    this.http.get(proxyUrl + pdfUrl, { responseType: 'blob' }).subscribe((blob: Blob) => {
      saveAs(blob, 'fake.pdf');
    });
  }
}
