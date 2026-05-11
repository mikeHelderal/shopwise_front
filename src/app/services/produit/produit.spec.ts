import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProduitService } from './produit'; // Vérifie le chemin du fichier

describe('ProduitService', () => {
  let service: ProduitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProduitService,
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProduitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('devrait récupérer la liste des produits (GET)', () => {
    const mockProduits = [
      { id: 1, nom: 'Cire coiffante', quantite: 10 },
      { id: 2, nom: 'Shampoing Bio', quantite: 5 }
    ];

    service.getProduits().subscribe(produits => {
      expect(produits.length).toBe(2);
      expect(produits).toEqual(mockProduits);
    });

    const req = httpMock.expectOne('http://localhost:8081/api/produits');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduits);
  });

  it('devrait enregistrer un nouveau produit (POST)', () => {
    const nouveauProduit = { nom: 'Laque', prixUnitaire: 12.5, quantite: 20 };
    const produitSauvegarde = { id: 10, ...nouveauProduit };

    service.saveProduit(nouveauProduit).subscribe(res => {
      expect(res.id).toBe(10);
      expect(res.nom).toBe('Laque');
    });

    const req = httpMock.expectOne('http://localhost:8081/api/produits');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(nouveauProduit);

    req.flush(produitSauvegarde);
  });

  afterEach(() => {
    httpMock.verify(); // Vérification finale des requêtes
  });
});
