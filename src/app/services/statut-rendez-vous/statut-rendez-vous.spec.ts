import { TestBed } from '@angular/core/testing';
import { StatutRendezVousService } from './statut-rendez-vous';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('StatutRendezVousService', () => {
  let service: StatutRendezVousService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StatutRendezVousService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(StatutRendezVousService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait envoyer une requête GET et retourner la liste des statuts', () => {
    const statutsSimules = [
      { id: 1, libelle: 'En attente' },
      { id: 2, libelle: 'Confirmé' },
      { id: 3, libelle: 'Honoré' }
    ];

    service.getStatus().subscribe((data) => {
      expect(data.length).toBe(3);
      expect(data).toEqual(statutsSimules);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/statuts');
    expect(req.request.method).toBe('GET');

    req.flush(statutsSimules);
  });
});
