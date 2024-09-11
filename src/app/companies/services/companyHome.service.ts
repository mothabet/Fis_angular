import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { environment } from 'src/environments/environment.development';
import { IAddCompany, ICompany } from '../Dtos/CompanyHomeDto';

@Injectable({
  providedIn: 'root'
})
export class CompanyHomeService {

  constructor(private sharedService: SharedService, private http: HttpClient) { }
  GetCompanies(textSearch : string | null,pageNumber:number) {
    var headers = this.sharedService.getHeaders();
    var response = this.http.get(environment.apiUrl + `Company/GetCompanies?textSearch=${textSearch}&pageNumber=${pageNumber}`, { headers });
    return response;
  }
  uploadFile(formData: FormData){
    var headers = this.sharedService.getHeaders();
    var response = this.http.post(environment.apiUrl + `Pdf/AddPdf`,formData, { headers });
    return response;
  }
  GetSectorActvities(sectorId : number) {
    var headers = this.sharedService.getHeaders();
    const response = this.http.get(`${environment.apiUrl}Activity/GetActivities?sectorId=${sectorId}`, { headers });
    return response;
  }
  GetSubActivities(activityId : number) {
    var headers = this.sharedService.getHeaders();
    var response = this.http.get(environment.apiUrl + `SubActivity/GetSubActivities?activityId=${activityId}`, { headers });
    return response;
  }
  GetSectors() {
    var headers = this.sharedService.getHeaders();
    var response = this.http.get(environment.apiUrl + `Sector/GetSectors`, { headers });
    return response;
  }
  GetWilayat(govId:number = 0) {
    var headers = this.sharedService.getHeaders();
    var response = this.http.get(environment.apiUrl + `Wilayat/GetWilayat?governorateId=${govId}`, { headers });
    return response;
  }
  GetGovernorates() {
    var headers = this.sharedService.getHeaders();
    var response = this.http.get(environment.apiUrl + `Governorates/GetGovernorates`, { headers });
    return response;
  }
  GetCompanyCode() {
    var headers = this.sharedService.getHeaders();
    var response = this.http.get(environment.apiUrl + `Company/GetCompanyCode`, { headers });
    return response;
  }
  addCompany(Model: IAddCompany) {
    
    var headers = this.sharedService.getHeaders();
    var response = this.http.post(environment.apiUrl + `Company/AddCompany`, Model, { headers });
    return response;
  }
  DeleteCompany(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`Company/DeleteCompany?id=${id}`, { headers });
     return response;
   }
   GetCompanyById(id:number){
    var headers= this.sharedService.getHeaders();
    
     var response = this.http.get(environment.apiUrl+`Company/GetCompany?id=${id}`, { headers });
     return response;
   }
   GetPdf(id:number){
    var headers= this.sharedService.getHeaders();
    
     var response = this.http.get(environment.apiUrl+`Pdf/GetPdf?id=${id}`, { headers });
     return response;
   }
   GetCompanyByUserId(id:number , compId:number = 0){
    
    var headers= this.sharedService.getHeaders();
     var response = this.http.get(environment.apiUrl+`Company/GetCompanyByUserId?id=${id}&companyId=${compId}`, { headers });
     return response;
   }
   GetProfileCompanyByUserId(){
    
    var headers= this.sharedService.getHeaders();
     var response = this.http.get(environment.apiUrl+`Company/GetProfileCompanyByUserId`, { headers });
     return response;
   }
   UpdateCompany(id:number,Model: IAddCompany){
    var headers= this.sharedService.getHeaders();
     var response = this.http.put(environment.apiUrl+`Company/UpdateCompany?id=${id}`, Model, { headers });
     return response;
   }
   UpdateCompanyToRecearcher(id:number,Model: ICompany[]){
    
    var headers= this.sharedService.getHeaders();
     var response = this.http.put(environment.apiUrl+`Company/UpdateCompanyToRecearcher?id=${id}`, Model, { headers });
     return response;
   }
   GetCompaniesByResearcherId(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.get(environment.apiUrl+`Company/GetCompaniesByResearcherId?researcherId=${id}&textSearch=''&pageNumber=0`, { headers });
     return response;
   }
   GetCompaniesIsSelectedResearcher(){
    var headers= this.sharedService.getHeaders();
     var response = this.http.get(environment.apiUrl+`Company/GetCompaniesIsSelectedResearcher?textSearch=''&pageNumber=0`, { headers });
     return response;
   }
   GetCompanyPdfs(id:number){
    
    var headers= this.sharedService.getHeaders();
     var response = this.http.get(environment.apiUrl+`Pdf/GetPdfs?companyId=${id}`, { headers });
     return response;
   }
   DeletePdf(id:number){
    var headers= this.sharedService.getHeaders();
     var response = this.http.delete(environment.apiUrl+`Pdf/DeletePdf?id=${id}`, { headers });
     return response;
   }
   UpdateProfileImg(formData: FormData,id:number) {
    var headers= this.sharedService.getHeaders();
    var resopnse = this.http.put(
      environment.apiUrl + `Company/UpdateProfileImg?id=${id}`,
      formData,
      { headers }
    );
    return resopnse;
  }
}
