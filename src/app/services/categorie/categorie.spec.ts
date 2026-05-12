import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { CategorieService } from './categorie';

describe('CategorieService', () => {
  let service: CategorieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategorieService,
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CategorieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('devrait récupérer la liste des catégories via une requête GET', () => {
    const mockCategories = [
      { id: 1, nom: 'Shampoing' },
      { id: 2, nom: 'Soin' }
    ];

    service.getCategories().subscribe(categories => {
      expect(categories.length).toBe(2);
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/categories');
    expect(req.request.method).toBe('GET');

    req.flush(mockCategories);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
