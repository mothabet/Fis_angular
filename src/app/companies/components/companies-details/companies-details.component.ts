import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICompany, IGetPdfDto, IPdfDto } from '../../Dtos/CompanyHomeDto';
import { ActivatedRoute } from '@angular/router';
import { CompanyHomeService } from '../../services/companyHome.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { LoginService } from 'src/app/auth/services/login.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TopScreenService } from 'src/app/shared/services/top-screen.service';

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
  hovering: boolean = false;
  selectedImage: File | null = null;
  selectedImageUrl!: string
  role:string = "";
  sanitizedEmbededContent: SafeHtml = '';

  constructor(private topScreenServices: TopScreenService, private activeRouter: ActivatedRoute, private companyServices: CompanyHomeService
    , private sharedServices: SharedService, private authService: LoginService,private sanitizer: DomSanitizer) {

  }
  ngOnInit(): void {
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.GetCompanyById(+this.companyId);
    this.GetCompanyPdfs(+this.companyId);
    const isLoggedIn = this.authService.getToken();
    let res = this.authService.decodedToken(isLoggedIn);  
    this.role = res.roles;
  }
  ngAfterViewInit(): void {

    this.showLoader = false;
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  GetCompanyById(id: number) {
    debugger
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.company = res.Data;
          this.sanitizedEmbededContent = this.sanitizeHtml(this.company.embeded);
          this.selectedImageUrl = `${environment.dirUrl}imageProfile/${this.company.pathImgProfile}`;
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
    debugger

    this.showLoader = true;
    const observer = {
      next: (res: any) => {
    debugger

        if (res.Data) {
          this.companyPdfs = res.Data;
        }
        else{
          this.companyPdfs = [];
        }
    this.showLoader = false;

      },
      error: (err: any) => {
    debugger

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
  downloadPdf(path: string): void {
    path = `${environment.dirUrl}PdfFile/Company_${this.companyId}/${path}`;
    this.companyServices.saveFile(path);
  }
  @ViewChild('imageInput') imageInput!: ElementRef;

  
  // Method to trigger file input click
  triggerImageUpload() {
    if (this.imageInput) {
      this.imageInput.nativeElement.click();
    }
  }

  // Handle selected image
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file; // Store the selected file
      this.UpdateProfileImg(); // Call the method to upload the image
    }
  }

  // Method to update profile image
  UpdateProfileImg(): void {
    if (!this.selectedImage) {
      return;
    }

    this.showLoader = true;
    const formData = new FormData();
    formData.append('imageDto', this.selectedImage, this.selectedImage.name);

    const observer = {
      next: (res: any) => {
        const newImageUrl = `${environment.dirUrl}imageProfile/${res.Data}`;
        this.selectedImageUrl = newImageUrl;

        // Update the shared image URL in the service
        this.topScreenServices.updateImageUrl(newImageUrl);
        this.showLoader = false;

      },
      error: (err: any) => {
        console.error('Error uploading image:', err);
        this.showLoader = false;
      },
    };

      this.companyServices.UpdateProfileImg(formData,+this.companyId).subscribe(observer);
  }
}
