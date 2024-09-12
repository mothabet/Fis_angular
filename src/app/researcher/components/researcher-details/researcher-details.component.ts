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

@Component({
  selector: 'app-researcher-details',
  templateUrl: './researcher-details.component.html',
  styleUrls: ['./researcher-details.component.css']
})
export class ResearcherDetailsComponent implements OnInit {
  role:string = "";
  showLoader: boolean = false;
  researcher!: IResearcher;
  researcherId!: string;
  companiesCount: number = 0;
  companies! : ICompany[]
  text: string = '';
  messages: IMessage[] = [];
  selectedMessage!: IMessage;
  forms: IGetFormDto[] = [];
  selectedCompanyIds: number[] = [];
  selectedFormId!: number; // To store selected form id
  selectedMessageId!: number;
  selectMessage: any; // Store the selected message details // To store selected message id
  formStatics!:any[];
  formsStaticsStatus!:any[];
  tableColumns = ['عنوان الشركه', 'رقم الشركة', 'اسم الشركة'];
  hovering: boolean = false;
  selectedImage: File | null = null;
  selectedImageUrl!: string
  constructor(private renderer: Renderer2,private topScreenServices:TopScreenService,private authService: LoginService,private formServices: FormService, private activeRouter: ActivatedRoute, private researcherServices: ResearcherHomeService, private sharedServices: SharedService, private messageService: HomemessagesService) {

  }
  ngOnInit(): void {
    this.researcherId = this.activeRouter.snapshot.paramMap.get('researcherId')!;
    this.topScreenServices.setResearcherId(this.researcherId);
    this.GetResearcherById(+this.researcherId);
    this.GetAllMessages(0, '')
    this.GetAllForms();
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
    this.GetFormsStatistics()
  }

  GetResearcherById(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        if (res.Data) {
          
          this.researcher = res.Data;
          this.companies = res.Data.companies
          this.selectedImageUrl = `${environment.dirUrl}imageProfile/${res.Data.pathImgProfile}`;
          
          this.companiesCount = this.researcher.companies.length;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherServices.GetResearcherById(id).subscribe(observer);
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
    this.researcherServices.GetFormsStatistics(+this.researcherId).subscribe(observer);
  }

  GetFormsByStatus(status:number) {
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
    this.researcherServices.GetFormsByStatus(+this.researcherId,status).subscribe(observer);
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
  GetAllForms(): void {
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
    this.formServices.GetAllForms().subscribe(observer);
  }

  onSubmit() {
    const formDto: SendCompanyFormsDto = {
      companiesIds: this.selectedCompanyIds, // Populate this with the relevant company IDs
      formId: this.selectedFormId,
      messageId: this.selectedMessageId,
      emailTitle: this.selectedMessage.arName || '',
      emailBody: this.selectedMessage.arDetails || ''
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
      this.selectedCompanyIds.push(company.id);
    } else {
      this.selectedCompanyIds = this.selectedCompanyIds.filter(id => id !== company.id);
    }
  }

  isSelected(companyId: number): boolean {
    return this.selectedCompanyIds.includes(companyId);
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
        this.selectedImageUrl = `${environment.dirUrl}imageProfile/${res.Data}`;
        this.showLoader = false;
      },
      error: (err: any) => {
        console.error('Error uploading image:', err);
        this.showLoader = false;
      },
    };

      this.researcherServices.UpdateProfileImg(formData,+this.researcherId).subscribe(observer);
  }
}
