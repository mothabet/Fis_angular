import { Component, OnInit } from '@angular/core';
import { ResearcherHomeService } from '../../services/researcher-home.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { IResearcher } from '../../Dtos/ResearcherHomeDto';
import { ActivatedRoute } from '@angular/router';

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
  text : string = ''
  constructor(private activeRouter: ActivatedRoute, private researcherServices: ResearcherHomeService, private sharedServices: SharedService) {

  }
  ngOnInit(): void {
    this.researcherId = this.activeRouter.snapshot.paramMap.get('researcherId')!;
    this.GetResearcherById(+this.researcherId);
  }
  GetResearcherById(id: number) {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        if (res.Data) {
          this.researcher = res.Data;
          this.companiesCount = this.researcher.companies.length;
          this.showLoader = false;
        }
      },
      error: (err: any) => {
        this.sharedServices.handleError(err);
        this.showLoader = false;
      },
    };
    this.researcherServices.GetResearcherById(id).subscribe(observer);
  }

  researcherCompanySerach(){
    debugger
    this.researcher.companies = this.researcher.companies.filter(c=>c.arName.includes(this.text)
                                && c.address.includes(this.text)&&c.arActivityName.includes(this.text)
                                && c.compRegNumber.includes(this.text) && c.email.includes(this.text))
  }
}
