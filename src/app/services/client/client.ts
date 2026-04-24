import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private apiUrl = 'http://localhost:8081/api/clients';

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer la liste des clients
  getClients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Ajoute cette méthode dans src/app/services/client.service.ts
  saveClient(client: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, client);
  }
}
