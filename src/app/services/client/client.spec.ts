import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ClientService } from './client'; // Ajuste le chemin si besoin

describe('ClientService', () => {
  let service: ClientService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientService,
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('devrait récupérer la liste des clients (GET)', () => {
    const mockClients = [
      { id: 1, nom: 'Alice', email: 'alice@test.com' },
      { id: 2, nom: 'Bob', email: 'bob@test.com' }
    ];

    service.getClients().subscribe(clients => {
      expect(clients.length).toBe(2);
      expect(clients).toEqual(mockClients);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/clients');
    expect(req.request.method).toBe('GET');
    req.flush(mockClients);
  });

  it('devrait enregistrer un nouveau client (POST)', () => {
    const nouveauClient = { nom: 'Charlie', email: 'charlie@test.com' };
    const clientGenere = { id: 3, ...nouveauClient };

    service.saveClient(nouveauClient).subscribe(client => {
      expect(client.id).toBe(3);
      expect(client.nom).toBe('Charlie');
    });

    const req = httpMock.expectOne('http://localhost:8081/api/clients');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nouveauClient); // On vérifie que le corps envoyé est correct

    req.flush(clientGenere);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
