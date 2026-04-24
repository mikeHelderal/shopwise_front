import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProduitService {
  private apiUrl = 'http://localhost:8081/api/produits';

  constructor(private http: HttpClient) { }

  getProduits(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  saveProduit(produit: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, produit);
  }}
