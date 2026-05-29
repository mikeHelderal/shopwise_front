import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:8081/api/clients';

  constructor(private http: HttpClient) { }

  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveClient(client: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, client);
  }

  getClientByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search`, {
      params: { email: email }
    });
  }
}
