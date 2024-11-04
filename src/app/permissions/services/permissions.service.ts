import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';
import { IGetPermissionDto } from '../Dtos/PermissionDto';
import { LoginService } from 'src/app/auth/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  constructor(private authService: LoginService,private sharedService:SharedService,private http:HttpClient) { }
  permissions: IGetPermissionDto[] = [];
  permissionModel: IGetPermissionDto={
    add:true,
    arName:"",
    delete:true,
    download:true,
    edit:true,
    enName:"",
    id:0,
    isName:true,
    settingsAuthId:0,
    addCompaniesGroup:true,
    connectWithCompany:true,
    copy:true
  };
   GetPermissionByUserId(UserId:number){
    var headers= this.sharedService.getHeaders();
     var resopnse = this.http.get(environment.apiUrl+`Permissions/GetPermissionByUserId?UserId=${UserId}&lang=2`, { headers });
     return resopnse;
   }
   FunctionGetPermissionByUserId(url:string): Promise<any> {
    const isLoggedIn = this.authService.getToken();
    let res = this.authService.decodedToken(isLoggedIn);
    return new Promise((resolve, reject) => {
      const observer = {
        next: (_res: any) => {
          if (_res.Data) {
            this.permissions = _res.Data;
            const permissionModel = this.permissions.find(r=>r.enName===url);
            resolve(permissionModel); // Resolve with the data
          } else {
            resolve(this.permissionModel); // Resolve with null if no data is found
          }
        },
        error: (err: any) => {
          this.sharedService.handleError(err);
          reject(err); // Reject on error
        },
      };
      this.GetPermissionByUserId(res.id).subscribe(observer);
    });
  }
  
}
