import { Component } from '@angular/core';
import { IGetTableDto } from '../../Dtos/TableDto';
import { ICoverFormDetailsDto, IGetActivitiesDto, IGetCountriesDto } from '../../Dtos/FormDto';
import { LoginService } from 'src/app/auth/services/login.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-one-year-with-parts-and-total',
  templateUrl: './one-year-with-parts-and-total.component.html',
  styleUrls: ['./one-year-with-parts-and-total.component.css']
})
export class OneYearWithPartsAndTotalComponent {
  Loader: boolean = false;
  isChecked!: boolean;
  formId: string = '';
  tableId: string = '';
  table!: IGetTableDto;
  coverForm!: ICoverFormDetailsDto;
  tablePartsCount = 0;
  countries! : IGetCountriesDto[];
  activities! : IGetActivitiesDto[];
  role:string = "";
  constructor(private authService: LoginService,private activeRouter: ActivatedRoute) {
    
  }
  ngOnInit(): void {
    this.formId = this.activeRouter.snapshot.paramMap.get('formId')!;
    this.tableId = this.activeRouter.snapshot.paramMap.get('tableId')!;
    const isLoggedIn = this.authService.getToken();
    let result = this.authService.decodedToken(isLoggedIn);  
    this.role = result.roles;
  }
}
