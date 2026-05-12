import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RendezVousService } from './rendez-vous';

describe('RendezVousService', () => {
  let service: RendezVousService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8081/api/rendez-vous';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RendezVousService,
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(RendezVousService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('devrait récupérer tous les rendez-vous (GET)', () => {
    const mockRdv = [{ id: 1, dateHeure: '2026-05-12T10:00' }];

    service.getRendezVous().subscribe(data => {
      expect(data).toEqual(mockRdv);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockRdv);
  });

  it('devrait enregistrer un nouveau rendez-vous (POST)', () => {
    const nouveauRdv = { dateHeure: '2026-05-15T14:00', client: { id: 1 } };

    service.saveRendezVous(nouveauRdv).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nouveauRdv);
    req.flush({ id: 50, ...nouveauRdv });
  });

  it('devrait marquer un rendez-vous comme honoré (PATCH)', () => {
    const idRdv = 123;

    service.honorerRdv(idRdv).subscribe(res => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${apiUrl}/${idRdv}/honorer`);
    expect(req.request.method).toBe('PATCH');
    req.flush({ status: 'HONORE' });
  });

  it('devrait supprimer un rendez-vous (DELETE)', () => {
    const idRdv = 456;

    service.deleteRendezvous(idRdv).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${idRdv}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
