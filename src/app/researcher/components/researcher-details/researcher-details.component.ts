import { Component, OnInit } from '@angular/core';
import { ResearcherHomeService } from '../../services/researcher-home.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IResearcher } from '../../Dtos/ResearcherHomeDto';
import { ActivatedRoute } from '@angular/router';
import { IMessage } from 'src/app/messages/Dtos/MessageDto';
import { HomemessagesService } from 'src/app/messages/services/homemessages.service';
import { IGetFormDto } from 'src/app/Forms/Dtos/FormDto';
import { FormService } from 'src/app/Forms/Services/form.service';

@Component({
  selector: 'app-researcher-details',
  templateUrl: './researcher-details.component.html',
  styleUrls: ['./researcher-details.component.css']
})
export class ResearcherDetailsComponent implements OnInit {
  showLoader: boolean = false;
  researcher!: IResearcher;
  researcherId!: string;
  companiesCount: number = 0;
  text: string = '';
  messages: IMessage[] = [];
  selectedMessage?: IMessage;
  forms: IGetFormDto[] = [];

  constructor(private formServices: FormService, private activeRouter: ActivatedRoute, private researcherServices: ResearcherHomeService, private sharedServices: SharedService, private messageService: HomemessagesService) {

  }
  ngOnInit(): void {
    this.researcherId = this.activeRouter.snapshot.paramMap.get('researcherId')!;
    this.GetResearcherById(+this.researcherId);
    this.GetAllMessages(0, '')
    this.GetAllForms();
  }
  GetResearcherById(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        this.showLoader = false;
        debugger
        if (res.Data) {
          this.researcher = res.Data;
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
    debugger
    const selectedMessageId = event.target.value;
    this.selectedMessage = this.messages.find(message => message.Id == selectedMessageId);
  }
  GetAllForms(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        debugger
        if (res.Data) {
          this.forms = res.Data;
          debugger
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
}
