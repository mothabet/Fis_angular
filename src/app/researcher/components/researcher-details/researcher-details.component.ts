import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ResearcherHomeService } from '../../services/researcher-home.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IResearcher } from '../../Dtos/ResearcherHomeDto';
import { ActivatedRoute } from '@angular/router';
import { IMessage } from 'src/app/messages/Dtos/MessageDto';
import { HomemessagesService } from 'src/app/messages/services/homemessages.service';
import { IGetFormDto, SendCompanyFormsDto } from 'src/app/Forms/Dtos/FormDto';
import { FormService } from 'src/app/Forms/Services/form.service';
import Swal from 'sweetalert2';
import { ICompany } from 'src/app/companies/Dtos/CompanyHomeDto';
import { LoginService } from 'src/app/auth/services/login.service';
import { TopScreenService } from 'src/app/shared/services/top-screen.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { arabicFont } from 'src/app/shared/services/arabic-font';
import { environment } from 'src/environments/environment.development';
import { IAdminDataDto } from '../../Dtos/ResearcherDetailsDto';
import { ResearcherMandateService } from 'src/app/researcher-mandate/services/researcher-mandate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAddResearcherMandateDto, IGetResearcherMandateDto } from 'src/app/researcher-mandate/Dtos/ResearcherMandateDto';
import { IGetPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';
import { PermissionsService } from 'src/app/permissions/services/permissions.service';

@Component({
  selector: 'app-researcher-details',
  templateUrl: './researcher-details.component.html',
  styleUrls: ['./researcher-details.component.css']
})
export class ResearcherDetailsComponent implements OnInit {
  role: string = "";
  researcherMandateForm!: FormGroup
  showLoader: boolean = false;
  researcher: IResearcher={
    activityId:0,
    activityName:0,
    address:"",
    arName:"",
    companies:[],
    compRegNumber:0,
    email:"",
    enName:"",
    id:0,
    phone:0,
    status:true,
    UserId:0,
    userName:""
  };
  researcherId!: string;
  companiesCount: number = 0;
  companies!: ICompany[];
  companiesSelect!: ICompany[];
  text: string = '';
  messages: IMessage[] = [];
  selectedMessage!: IMessage;
  forms: IGetFormDto[] = [];
  selectedCompanyIds: number[] = [];
  selectedFormId!: number; // To store selected form id
  selectedMessageId!: number;
  selectMessage: any; // Store the selected message details // To store selected message id
  formStatics!: any[];
  formsStaticsStatus!: any[];
  tableColumns = ['عنوان الشركه', 'رقم الشركة', 'اسم الشركة'];
  hovering: boolean = false;
  selectedImage: File | null = null;
  selectedImageUrl!: string;
  getResearcherMandateDto: IGetResearcherMandateDto[] = [];
  addResearcherMandateDto!: IAddResearcherMandateDto;
  researchers: IResearcher[] = [];
  researchersMandate: IResearcher[] = [];
  companyResearcherMandate : ICompany[] = [];
  adminData: IAdminDataDto = {
    adminEmail: '',
    adminPhone: '',
    adminName: ''
  };
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  searchText: string = '';
  noData: boolean = false;
  fromDate: Date | null = null;
  toDate: Date | null = null;
  selectedCompaniesNames: string = '';  // لعرض أسماء الشركات المختارة
  selectedCompanyIdsIsResearcher: Set<number> = new Set<number>();
  selecteCompanyIds: Set<number> = new Set<number>();
  researcherMandateId!: string;
  getCompanyResearcherMandateDto:any[] = [];
  permissionResearcherDetails: IGetPermissionDto = {
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
  isAllSelected: boolean = false;

  constructor(private renderer: Renderer2, private topScreenServices: TopScreenService, private authService: LoginService,
    private formServices: FormService, private activeRouter: ActivatedRoute, private researcherServices: ResearcherHomeService,
    private formBuilder: FormBuilder, private sharedServices: SharedService, private messageService: HomemessagesService
    , private researcherMandateService: ResearcherMandateService,
    private permissionsService: PermissionsService) {

  }
  ngOnInit(): void {
    this.researcherId = this.activeRouter.snapshot.paramMap.get('researcherId')!;
    this.topScreenServices.setResearcherId(this.researcherId);
    this.GetResearcherById(+this.researcherId,1,'');
    this.GetAllMessages(0, '')
    this.GetAllForms("2024");
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);
    this.role = result.roles;
    this.GetFormsStatistics()
    this.GetAllReseachers();
    this.researcherMandateForm = this.formBuilder.group({
      researcherMandateId: ['', Validators.required],
    });
    this.GetPermissionResearcherDetailsByUserId();
  }
  GetPermissionResearcherDetailsByUserId() {
    this.permissionsService.FunctionGetPermissionByUserId("Researcher-Details").then(permissions => {
      this.permissionResearcherDetails = permissions;
    });
  }
  onCheckboxChangeCompany(companyId: number, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.checked) {
      this.selecteCompanyIds.add(companyId);
      this.selectedCompanyIdsIsResearcher.add(companyId);
    } else {
      this.selecteCompanyIds.delete(companyId);
      this.selectedCompanyIdsIsResearcher.delete(companyId);
    }
  }
  onSelectCompanies(event: Event) {
    const selectedOptions = (event.target as HTMLSelectElement).selectedOptions;
    const selectedCompanyIds = Array.from(selectedOptions).map(option => option.value);
    const selectedCompanyNames = Array.from(selectedOptions).map(option => option.text);

    // تحديث القيم في النموذج
    this.researcherMandateForm.patchValue({
      companyIds: selectedCompanyIds
    });

    // تحديث حقل الإدخال بأسماء الشركات المختارة
    this.selectedCompaniesNames = selectedCompanyNames.join(', ');
  }
  GetResearcherById(id: number,page: number, textSearch: string = '') {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        
        if (res.Data) {
          this.researcher = res.Data;
          this.noData = !res.Data.companies.getCompaniesDtos || res.Data.companies.getCompaniesDtos.length === 0;
          this.companies = res.Data.companies.getCompaniesDtos;
          this.companiesSelect = this.companies.filter(c=>c.researcherArName === "");
          this.currentPage = res.Data.companies.PageNumber;
          this.isLastPage = res.Data.companies.LastPage;
          this.totalPages = res.Data.companies.TotalCount;
          this.selectedImageUrl = `${environment.dirUrl}imageProfile/${res.Data.pathImgProfile}`;
          this.companiesCount = res.Data.companiesCount;
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherServices.GetResearcherByIdWithCompaniesAndCompaniesMandate(id,page,textSearch).subscribe(observer);
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetResearcherById(+this.researcherId ,page);
  }
  companiesSearch() {
    this.GetResearcherById(+this.researcherId ,this.currentPage, this.searchText);
  }
  GetFormsStatistics() {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        if (res.Data) {
          this.formStatics = res.Data
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherServices.GetFormsStatistics(+this.researcherId,this.fromDate,this.toDate).subscribe(observer);
  }

  GetFormsByStatus(status: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        if (res.Data) {
          this.formsStaticsStatus = res.Data
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherServices.GetFormsByStatus(+this.researcherId, status).subscribe(observer);
  }

  openModal() {
    const modalElement = document.getElementById('formsStatics');
    if (modalElement) {
      this.renderer.addClass(modalElement, 'show');
      this.renderer.setStyle(modalElement, 'display', 'block');
      this.renderer.setStyle(modalElement, 'opacity', '1');
    }
  }
  closeModal() {
    const modalElement = document.getElementById('formsStatics');
    if (modalElement) {
      this.renderer.removeClass(modalElement, 'show');
      this.renderer.setStyle(modalElement, 'display', 'none');
      this.renderer.setStyle(modalElement, 'opacity', '0');
    }
  }

  researcherCompanySerach() {
    this.researcher.companies = this.researcher.companies.filter(c => c.arName.includes(this.text)
      && c.address.includes(this.text) && c.arActivityName.includes(this.text)
      && c.compRegNumber.includes(this.text) && c.email.includes(this.text))
  }
  GetAllMessages(page: number, textSearch: string = ''): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.messages = [];

          res.Data.getMessagesDtos.forEach((message: IMessage) => {
            switch (message.typeMessage) {
              case 2:
                this.messages.push(message);
                break;
            }
          });
        }
        else {
          this.messages = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.messageService.GetAllMessages(page, textSearch).subscribe(observer);
  }
  onSelectMessage(event: any): void {
    const selectedMessageId = event.target.value;
    this.selectedMessage = this.messages.find(message => message.Id == selectedMessageId)!;
    const selectedValue = event.target.value;
    if (event.target.name === 'formType') {
      this.selectedFormId = +selectedValue; // Convert to number
    } else if (event.target.name === 'messageType') {
      this.selectedMessageId = +selectedValue; // Convert to number
      this.selectedMessage = this.messages.find(msg => msg.Id === this.selectedMessageId)!;
    }
  }
  GetAllForms(yearSelect:string): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.forms = res.Data;
        } else {
          const element = document.getElementById('items');
          if (element) {
            element.classList.add('d-none');
          }
          const maindiv = document.getElementById('main');
          if (maindiv) {
            maindiv.innerHTML = ''; // Clear the content
          }
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.formServices.GetAllForms("","").subscribe(observer);
  }

  onSubmit() {
    const formDto: SendCompanyFormsDto = {
      companiesIds: this.selectedCompanyIds, // Populate this with the relevant company IDs
      formId: this.selectedFormId,
      messageId: this.selectedMessageId,
      emailTitle: this.selectedMessage.arName || '',
      emailBody: this.selectedMessage.arDetails || '',
      adminEmail: this.adminData.adminEmail,
      adminName: this.adminData.adminName,
      adminPhone: this.adminData.adminPhone
    };
    this.showLoader = true;

    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        const button = document.getElementById('closePopup');
        if (button) {
          button.click();
        }
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: false,
          timer: 2000
        });
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.formServices.sendForm(formDto).subscribe(observer);
  }
  onCheckboxChange(event: any, company: any): void {
    if (event.target.checked) {
      // إضافة الشركة إلى القائمة
      this.selectedCompanyIds.push(company.id);
    } else {
      // إزالة الشركة من القائمة
      this.selectedCompanyIds = this.selectedCompanyIds.filter(id => id !== company.id);
    }
  
    // تحديث حالة اختيار الكل
    this.updateSelectAllState();
  }
  
  // اختيار أو إلغاء اختيار الكل
  toggleSelectAll(event: any): void {
    this.isAllSelected = event.target.checked;
    if (this.isAllSelected) {
      // اختيار جميع الشركات
      this.selectedCompanyIds = this.companies.map(company => company.id);
    } else {
      // إلغاء تحديد جميع الشركات
      this.selectedCompanyIds = [];
    }
  }
  
  // التحقق مما إذا كانت الشركة محددة
  isSelected(companyId: number): boolean {
    return this.selectedCompanyIds.includes(companyId);
  }
  
  // تحديث حالة اختيار الكل بناءً على الشركات المختارة
  updateSelectAllState(): void {
    const allSelected = this.companies.length > 0 && this.companies.every(company => this.selectedCompanyIds.includes(company.id));
    this.isAllSelected = allSelected;
  }

  printPdf() {
    this.generatePdf(this.companies, this.tableColumns);
  }
  generatePdf(data: any[], columns: string[]) {
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    // Add the Arabic font to jsPDF
    doc.addFileToVFS('Arabic-Regular.ttf', arabicFont);
    doc.addFont('Arabic-Regular.ttf', 'Arabic', 'normal');
    doc.setFont('Arabic');

    // Add a title
    doc.text('الشركات المرتبطه بالباحث', 10, 10);

    // Generate the table
    autoTable(doc, {
      head: [columns],
      body: data.map((item, index) => [
        item.address,
        item.id,
        item.arName,
      ]),
      styles: {
        font: 'Arabic',
        halign: 'right' // Horizontal alignment
      },
      bodyStyles: {
        halign: 'right'
      },
      headStyles: {
        halign: 'right'
      }
    });

    // Save the PDF
    doc.save('Researcher Companies.pdf');
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
        const newImageUrl = `${environment.dirUrl}imageProfile/${res.Data.imageDto}`;
        this.selectedImageUrl = newImageUrl;

        // Update the shared image URL in the service
        this.topScreenServices.updateImageUrl(newImageUrl,res.Data.arName);

        this.showLoader = false;
      },
      error: (err: any) => {
        console.error('Error uploading image:', err);
        this.showLoader = false;
      },
    };

    this.researcherServices.UpdateProfileImg(formData, +this.researcherId).subscribe(observer);
  }
  GetAllReseachers(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.researchers = res.Data.getResearcherDtos;
        }
        else {
          this.researchers = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherServices.GetAllReseachers(0, '').subscribe(observer);
  }

  resetForm(): void {
    // this.addResearcherMandateDto = [];
    this.researcherMandateForm.reset({
      fromDate: '',
      toDate: '',
      researcherMandateId: '',
      IsCancelled: false
    });
  }
  AddResearcherMandate() {
    this.showLoader = true;
    
    if (this.selecteCompanyIds.size >0 && this.researcherMandateId != "") {
      const selectedCompanies = this.companies
  .filter(company => this.selecteCompanyIds.has(company.id))
  .map(company => company.id);
      const Model: IAddResearcherMandateDto = {
        researcherId: this.researcherId,
        researcherMandateId: this.researcherMandateId,
        selectedCompanies :selectedCompanies
      }
      const observer = {
        next: (res: any) => {
          const button = document.getElementById('btnCancelCompanyResearcher');
          if (button) {
            button.click();
          }
          this.resetForm();
          this.showLoader = false;
          Swal.fire({
            icon: 'success',
            title: res.Message,
            showConfirmButton: false,
            timer: 2000
          });
        },
        error: (err: any) => {
          this.sharedServices.handleError(err);
          this.showLoader = false;
        },
      };
      this.researcherMandateService.AddResearcherMandate(Model).subscribe(observer);
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'يجب ادخال البيانات بشكل صحيح',
        showConfirmButton: false,
        timer: 2000
      });
      this.showLoader = false;
    }
  }
  AddResearcherMandateModel() {

    this.researchersMandate = this.researchers.filter(researcher => researcher.UserId !== +this.researcherId);
  }
  GetAllResearcherMandate(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        
        if (res.Data) {
          this.getResearcherMandateDto = res.Data.getResearcherMandateDtos;
          const button = document.getElementById('AllResearcherMandateBtn');
          if (button) {
            button.click();
          }
          this.showLoader = false;
        }
        else {
          Swal.fire({
            icon: 'error',
            title: res.Message,
            showConfirmButton: true,
            confirmButtonText: 'اغلاق'
          });
          this.showLoader = false;

        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherMandateService.GetAllResearcherMandate(this.researcherId, 0).subscribe(observer);
  }
  GetCompanyResearcherMandate(id:number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        
        
        if (res.Data) {
          this.getCompanyResearcherMandateDto = res.Data;
          const button = document.getElementById('CompanyResearcherMandateBtn');
          if (button) {
            button.click();
          }
          this.showLoader = false;
        }
        else {
          Swal.fire({
            icon: 'error',
            title: res.Message,
            showConfirmButton: true,
            confirmButtonText: 'اغلاق'
          });
          this.showLoader = false;

        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherMandateService.GetCompanyResearcherMandate(id).subscribe(observer);
  }
  
  GetResearcherMandateByResearcherId(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.addResearcherMandateDto = res.Data.getResearcherMandateDto;
        if(this.addResearcherMandateDto != null)
          this.researcherMandateId = this.addResearcherMandateDto.researcherMandateId;
        this.selecteCompanyIds = new Set<number>();
        for (let index = 0; index < res.Data.getCompaniesDtos.length; index++) {
          this.selecteCompanyIds.add(res.Data.getCompaniesDtos[index].id)
        }
        const button = document.getElementById('btnCancelresearcherMandate');
        if (button) {
          button.click();
        }
        const button_ = document.getElementById('addResearcherBtn');
        if (button_) {
          button_.click();
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherMandateService.GetResearcherMandateByResearcherId(this.researcherId, 0).subscribe(observer);
  }
  getDateOnly(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // إضافة صفر في حالة كان الشهر أقل من 10
    const day = ('0' + date.getDate()).slice(-2); // إضافة صفر في حالة كان اليوم أقل من 10
    return `${year}-${month}-${day}`;
  }
  
  CancelResearcherMandate(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        const button = document.getElementById('btnCancelresearcherMandate');
        if (button) {
          button.click();
        }
        this.showLoader = false;
        Swal.fire({
          icon: 'success',
          title: res.Message,
          showConfirmButton: true,
          confirmButtonText: 'اغلاق'

        })
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherMandateService.CancelResearcherMandate(id).subscribe(observer);
  }
  closebtnCancelresearcherMandate(){
    const button = document.getElementById('AllResearcherMandateBtn');
    if (button) {
      button.click();
    }}
}
