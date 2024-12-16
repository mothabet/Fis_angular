import { Component } from '@angular/core';
import { IGetAllNotificationDto } from '../../Dtos/NotificationDto';
import { NotificationsService } from '../../Services/notifications.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-notifications-home',
  templateUrl: './notifications-home.component.html',
  styleUrls: ['./notifications-home.component.css']
})
export class NotificationsHomeComponent {
  showLoader: boolean = false;
  currentPage: number = 1;
  isLastPage: boolean = false;
  totalPages: number = 0;
  noData: boolean = false;
  getAllNotificationDto : IGetAllNotificationDto[] = [];
  constructor(
      private service: NotificationsService,
      private sharedService: SharedService,
    ) { }
  ngOnInit(): void {
    this.GetNotificationsByUserId(1);
    this.UpdateToReadNotificationByUserId();
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.GetNotificationsByUserId(page);
  }
  GetNotificationsByUserId(page: number): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {
        
        this.noData = !res.Data.getNotificationsDtos || res.Data.getNotificationsDtos.length === 0;
        if (res.Data.getNotificationsDtos) {
          this.getAllNotificationDto = res.Data.getNotificationsDtos;
          this.currentPage = page;
          this.isLastPage = res.Data.LastPage;
          this.totalPages = res.Data.TotalCount;
        }
        else {
          this.getAllNotificationDto = [];
        }
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.service.GetNotificationsByUserId(page).subscribe(observer);
  }
  UpdateToReadNotificationByUserId(): void {
    this.showLoader = true;
    const observer = {
      next: (res: any) => {        
        this.showLoader = false;
      },
      error: (err: any) => {
        this.sharedService.handleError(err);
        this.showLoader = false;
      },
    };
    this.service.UpdateToReadNotificationByUserId().subscribe(observer);
  }
}
