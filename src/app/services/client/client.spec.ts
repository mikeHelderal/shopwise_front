import { TestBed } from '@angular/core/testing';
import { ClientService } from './client';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientService,

        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait envoyer une requête GET et retourner la liste des clients', () => {
    const clientsSimules = [
      { id: 1, nom: 'Jean Dupont', email: 'jean@test.com', telephone: '0601020304' }
    ];

    service.getClients().subscribe((data) => {
      expect(data.length).toBe(1);
      expect(data).toEqual(clientsSimules);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/clients');
    expect(req.request.method).toBe('GET');
    req.flush(clientsSimules);
  });

  it('devrait envoyer une requête POST pour enregistrer un nouveau client', () => {
    const nouveauClient = { nom: 'Lucie Martin', email: 'lucie@test.com', telephone: '0701020304' };
    const reponseServeur = { id: 2, ...nouveauClient };

    service.saveClient(nouveauClient).subscribe((data) => {
      expect(data).toEqual(reponseServeur);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/clients');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nouveauClient);
    req.flush(reponseServeur);
  });


  it('devrait envoyer une requête GET avec le paramètre email lors de la recherche', () => {
    const emailCible = 'jean@test.com';
    const clientTrouve = { id: 1, nom: 'Jean Dupont', email: emailCible };

    service.getClientByEmail(emailCible).subscribe((data) => {
      expect(data).toEqual(clientTrouve);
    });

    const req = httpMock.expectOne((request) => request.url === 'http://localhost:8081/api/clients/search');

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('email')).toBe(emailCible);

    req.flush(clientTrouve);
  });
});
