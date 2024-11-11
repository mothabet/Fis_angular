import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/services/login.service';
import { IGetPermissionDto } from 'src/app/permissions/Dtos/PermissionDto';
import { SharedService } from '../../services/shared.service';
import { PermissionsService } from 'src/app/permissions/services/permissions.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  role: string = "";
  id: number = 0;
  isAuditingRules: boolean = false;
  permissions: IGetPermissionDto[] = [];
  constructor(private authService: LoginService, private router: Router
    , private permissionsService: PermissionsService, private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    const isLoggedIn = this.authService.getToken();
    let res = this.authService.decodedToken(isLoggedIn);
    this.role = res.roles;
    this.id = res.id;
    if (this.role === "User"|| this.role==='Researchers') {
      this.GetPermissionByUserId(res);
    }
  }
  
  GetPermissionByUserId(res: any) {
    const observer = {
      next: (_res: any) => {
        if (_res.Data) {
          this.permissions = _res.Data;
        }
      },
      error: (err: any) => {

        this.sharedService.handleError(err);
      },
    };
    this.permissionsService.GetPermissionByUserId(res.id).subscribe(observer);
  }
  checkPermission(url: string): boolean {
    
    if (this.role === "User"|| this.role==='Researchers') {

      const permissionCheck = this.permissions.find(r => r.enName === url);
      if (permissionCheck && permissionCheck.isName) {
        return true;
      }
      else {
        return false;
      }
    }
    else
      return true
  }
}
