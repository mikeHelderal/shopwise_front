import { TestBed } from '@angular/core/testing';
import { ProduitService } from './produit';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ProduitService', () => {
  let service: ProduitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProduitService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProduitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });


  it('devrait envoyer une requête GET et retourner la liste des produits', () => {
    const produitsSimules = [
      { id: 1, nom: 'Shampooing Purifiant', prixUnitaire: 14.99, quantite: 10 },
      { id: 2, nom: 'Huile de Barbe', prixUnitaire: 22.50, quantite: 5 }
    ];

    service.getProduits().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(produitsSimules);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/produits');
    expect(req.request.method).toBe('GET');

    req.flush(produitsSimules);
  });

  it('devrait envoyer une requête POST pour enregistrer un nouveau produit', () => {
    const nouveauProduit = { nom: 'Gel Coiffant', prixUnitaire: 9.99, quantite: 15 };
    const reponseServeur = { id: 3, ...nouveauProduit };

    service.saveProduit(nouveauProduit).subscribe((data) => {
      expect(data).toEqual(reponseServeur);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/produits');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nouveauProduit);

    req.flush(reponseServeur);
  });
});
