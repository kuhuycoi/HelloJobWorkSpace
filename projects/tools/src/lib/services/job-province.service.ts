import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobProvinceService {

  constructor(private http: HttpClient) { }
  baseUrl = '/User/JobProvince';

  public findAllAvaiable(lang?: string) {
    let url = `${localStorage.getItem('ServerUrl')}${this.baseUrl}/FindAllAvaiable?lang=${lang}`;
    if (!lang) {
      url = `${localStorage.getItem('ServerUrl')}${this.baseUrl}/FindAllAvaiable`;
    }
    return this.http.get(url);
  }
  public insert(item) {
    return this.http.post(`${localStorage.getItem('ServerUrl')}${this.baseUrl}/Insert`, item);
  }
  public delete(id: number) {
    return this.http.delete(`${localStorage.getItem('ServerUrl')}${this.baseUrl}/Delete/${id}`);
  }
  public edit(item) {
    return this.http.post(`${localStorage.getItem('ServerUrl')}${this.baseUrl}/Edit`, item);
  }

}
