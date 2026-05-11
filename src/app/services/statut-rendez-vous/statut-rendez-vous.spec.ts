import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { StatutRendezVousService } from './statut-rendez-vous';

describe('StatutRendezVousService', () => {
  let service: StatutRendezVousService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StatutRendezVousService,
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(StatutRendezVousService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('devrait récupérer la liste des statuts (GET)', () => {
    const mockStatuts = [
      { id: 1, libelle: 'En attente' },
      { id: 2, libelle: 'Honoré' },
      { id: 3, libelle: 'Annulé' }
    ];

    service.getStatus().subscribe(statuts => {
      expect(statuts.length).toBe(3);
      expect(statuts).toEqual(mockStatuts);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/statuts');
    expect(req.request.method).toBe('GET');
    req.flush(mockStatuts);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
