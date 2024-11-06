import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ICompany, ICompanyEmail, IGetPdfDto, IPdfDto } from '../../Dtos/CompanyHomeDto';
import { ActivatedRoute, Data } from '@angular/router';
import { CompanyHomeService } from '../../services/companyHome.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { LoginService } from 'src/app/auth/services/login.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TopScreenService } from 'src/app/shared/services/top-screen.service';
import { PermissionsService } from 'src/app/permissions/services/permissions.service';
import { IGetPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';

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
  companyEmails:string = '';
  legalTypeName:string = '';
  permission: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany:true,
    addCompaniesGroup:true,
    copy:true,
    Instructions:true,
    FormNotes: true,  
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionCopmanyMessages: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany:true,
    addCompaniesGroup:true,
    copy:true,
    Instructions:true,
    FormNotes: true,  
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionCopmanyGeneralInformation: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany:true,
    addCompaniesGroup:true,
    copy:true,
    Instructions:true,
    FormNotes: true,  
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  permissionForms: IGetPermissionDto = {
    add: true,
    arName: "",
    delete: true,
    download: true,
    edit: true,
    enName: "",
    id: 0,
    isName: true,
    settingsAuthId: 0,
    connectWithCompany:true,
    addCompaniesGroup:true,
    copy:true,
    Instructions:true,
    FormNotes: true,  
    AddFormNotes:true,
    Approve: true, 
    Complete: true, 
    Close: true, 
    Open: true
  };
  constructor(private topScreenServices: TopScreenService, private activeRouter: ActivatedRoute, private companyServices: CompanyHomeService
    , private sharedServices: SharedService, private authService: LoginService,private sanitizer: DomSanitizer,
    private permissionsService: PermissionsService) {

  }
  ngOnInit(): void {
    this.companyId = this.activeRouter.snapshot.paramMap.get('companyId')!;
    this.GetCompanyById(+this.companyId);
    this.GetCompanyPdfs(+this.companyId);
    const isLoggedIn = this.authService.getToken();
    let res = this.authService.decodedToken(isLoggedIn);  
    this.role = res.roles;
    this.GetPermissionByUserId();
    this.GetPermissionByUserIdForms();
    this.GetPermissionByUserIdCopmanyMessages();
    this.GetPermissionByUserIdCopmanyGeneralInformation();
  }
  GetPermissionByUserId() {
    this.permissionsService.FunctionGetPermissionByUserId("Companies-Details").then(permissions => {
      this.permission = permissions;
    });
  }
  GetPermissionByUserIdForms() {
    this.permissionsService.FunctionGetPermissionByUserId("CompanyHome").then(permissions => {
      this.permissionForms = permissions;
    });
  }
  GetPermissionByUserIdCopmanyMessages() {
    this.permissionsService.FunctionGetPermissionByUserId("CopmanyMessages").then(permissions => {
      this.permissionCopmanyMessages = permissions;
    });
  }
  GetPermissionByUserIdCopmanyGeneralInformation() {
    this.permissionsService.FunctionGetPermissionByUserId("CopmanyGeneralInformation").then(permissions => {
      this.permissionCopmanyGeneralInformation = permissions;
    });
  }
  ngAfterViewInit(): void {

    this.showLoader = false;
  }
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  GetCompanyById(id: number) {
    
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.company = res.Data;
          console.log(this.company)
          if (this.company.legalType == "1") {
            this.legalTypeName = "منشاة فردية"
          }
          else if (this.company.legalType == "2"){
            this.legalTypeName = "تضامنية"
          }
          else if (this.company.legalType == "3"){
            this.legalTypeName = "توصية"
          }
          else if (this.company.legalType == "4"){
            this.legalTypeName = "محاصة"
          }
          else if (this.company.legalType == "5"){
            this.legalTypeName = "مساهمة ( عامه او مقفله )"
          }
          else if (this.company.legalType == "6"){
            this.legalTypeName = "محدودة المسؤولية"
          }
          else if (this.company.legalType == "7"){
            this.legalTypeName = "فرع شركة اجنبية"
          }
          else if (this.company.legalType == "8"){
            this.legalTypeName = "أخرى (حدد)"
          }

          this.companyEmails = res.Data.companyEmails.map((emailObj: ICompanyEmail) => emailObj.Email)
          .join(', ');          this.sanitizedEmbededContent = this.sanitizeHtml(this.company.embeded);
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
    

    this.showLoader = true;
    const observer = {
      next: (res: any) => {
    

        if (res.Data) {
          this.companyPdfs = res.Data;
        }
        else{
          this.companyPdfs = [];
        }
    this.showLoader = false;

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
    path = `${environment.dirUrl}PdfFile/Company_${this.company.id}/${path}`;
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
  getDateOnly(dateTimeString: Date): string {
    if(dateTimeString!=null && dateTimeString.toString() != ""){
      const date = new Date(dateTimeString.toString());
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // إضافة صفر في حالة كان الشهر أقل من 10
      const day = ('0' + date.getDate()).slice(-2); // إضافة صفر في حالة كان اليوم أقل من 10
      return `${year}-${month}-${day}`;
    }
    else
      return ""
  }
  
}
