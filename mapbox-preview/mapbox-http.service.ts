import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'environments/environment';
import api from '@env/api.env';

@Injectable({
  providedIn: 'root'
})
export class MapboxHttpService {
  private baseUrl = environment.api.defaultContextPath;

  constructor(
    private http: HttpClient
) { }

  public getListProvince() {
    const url = this.baseUrl + api.egpCostPublic.costUtil.getListProvince;
    return this.http.get<any>(url).pipe();
  }

  public getListDistrict(params: any) {
    const url = this.baseUrl + api.egpCostPublic.costUtil.getListDistrict;
    return this.http.get<any>(url, { params: params }).pipe();
  }

  public getListSubDistrict(params: any) {
    const url = this.baseUrl + api.egpCostPublic.costUtil.getListSubDistrict;
    return this.http.get<any>(url, { params: params }).pipe();
  }

  public getListSector(params: any) {
    const url = this.baseUrl + api.egpCostPublic.costUtil.getListSector;
    return this.http.get<any>(url, { params: params }).pipe();
  }

  public getListEgpProjectByLatLong(params: any) {
    const url = this.baseUrl + api.egpCostPublic.map.getListEgpProjectByLatLong;
    return this.http.get<any>(url, { params: params }).pipe();
  }

  public getListDashboardDeptName(params: any) {
    const url = this.baseUrl + api.egpCostPublic.map.getListDashboardDeptName;
    return this.http.get<any>(url, { params: params }).pipe();
  }

}

