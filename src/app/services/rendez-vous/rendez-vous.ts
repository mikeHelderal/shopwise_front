import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RendezVousService {
  private apiUrl = 'http://localhost:8081/api/rendez-vous';

  constructor(private http: HttpClient) { }

  getRendezVous(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveRendezVous(rdv: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, rdv);
  }

  honorerRdv(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/honorer`, {});
  }

  deleteRendezvous(id: number): Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
