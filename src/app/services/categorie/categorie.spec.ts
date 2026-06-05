import { TestBed } from '@angular/core/testing';
import { CategorieService } from './categorie';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('CategorieService', () => {
  let service: CategorieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategorieService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CategorieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {

    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait envoyer une requête GET et retourner la liste des catégories', () => {
    const categoriesSimulees = [
      { id: 1, nom: 'Coiffure' },
      { id: 2, nom: 'Soins du visage' },
      { id: 3, nom: 'Massage' }
    ];


    service.getCategories().subscribe((data) => {
      expect(data.length).toBe(3);
      expect(data).toEqual(categoriesSimulees);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/categories');
    expect(req.request.method).toBe('GET');

    req.flush(categoriesSimulees);
  });
});
