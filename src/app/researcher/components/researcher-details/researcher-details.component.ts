import { Component, OnInit } from '@angular/core';
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
  constructor(private authService: LoginService,private formServices: FormService, private activeRouter: ActivatedRoute, private researcherServices: ResearcherHomeService, private sharedServices: SharedService, private messageService: HomemessagesService) {

  }
  ngOnInit(): void {
    this.researcherId = this.activeRouter.snapshot.paramMap.get('researcherId')!;
    this.GetResearcherById(+this.researcherId);
    this.GetAllMessages(0, '')
    this.GetAllForms();
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
  }

  GetResearcherById(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        if (res.Data) {
          debugger
          this.researcher = res.Data;
          this.companies = res.Data.companies
          debugger
          console.log(this.companies)
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

  researcherCompanySerach() {
    debugger
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
          debugger
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


}
