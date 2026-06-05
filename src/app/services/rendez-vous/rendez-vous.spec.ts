import { TestBed } from '@angular/core/testing';
import { RendezVousService } from './rendez-vous';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('RendezVousService', () => {
  let service: RendezVousService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RendezVousService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(RendezVousService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait envoyer une requête GET et retourner la liste des rendez-vous', () => {
    const rdvSimules = [
      { id: 1, dateHeure: '2026-05-12T10:00', client: { id: 1 }, statut: { id: 1 } },
      { id: 2, dateHeure: '2026-05-12T11:00', client: { id: 2 }, statut: { id: 2 } }
    ];

    service.getRendezVous().subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data).toEqual(rdvSimules);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/rendez-vous');
    expect(req.request.method).toBe('GET');

    req.flush(rdvSimules);
  });

  it('devrait envoyer une requête POST pour créer un nouveau rendez-vous', () => {
    const nouveauRdv = { dateHeure: '2026-05-12T14:00', client: { id: 1 }, statut: { id: 1 } };
    const reponseServeur = { id: 3, ...nouveauRdv };

    service.saveRendezVous(nouveauRdv).subscribe((data) => {
      expect(data).toEqual(reponseServeur);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/rendez-vous');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nouveauRdv);

    req.flush(reponseServeur);
  });

  it('devrait envoyer une requête PATCH pour marquer un rendez-vous comme honoré', () => {
    const rdvId = 42;
    const reponseServeur = { id: rdvId, statut: { id: 3, libelle: 'Honoré' } };

    service.honorerRdv(rdvId).subscribe((data) => {
      expect(data).toEqual(reponseServeur);
    });

    const req = httpMock.expectOne(`http://localhost:8081/api/rendez-vous/${rdvId}/honorer`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({});

    req.flush(reponseServeur);
  });

  it('devrait envoyer une requête DELETE pour annuler un rendez-vous', () => {
    const rdvId = 99;

    service.deleteRendezvous(rdvId).subscribe((data) => {
      expect(data).toBeNull();
    });

    const req = httpMock.expectOne(`http://localhost:8081/api/rendez-vous/${rdvId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});
