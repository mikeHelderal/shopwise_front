import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProduitList } from './produit-list';
import { ProduitService } from '../../services/produit/produit';
import { CategorieService } from '../../services/categorie/categorie';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { vi } from 'vitest';

describe('ProduitList (Component)', () => {
  let component: ProduitList;
  let fixture: ComponentFixture<ProduitList>;

  const mockProduitService = {
    getProduits: vi.fn(),
    saveProduit: vi.fn()
  };
  const mockCategorieService = {
    getCategories: vi.fn()
  };

  beforeEach(async () => {
    mockProduitService.getProduits.mockReturnValue(of([]));
    mockCategorieService.getCategories.mockReturnValue(of([{ id: 1, nom: 'Shampoing' }]));

    await TestBed.configureTestingModule({
      imports: [ProduitList, FormsModule],
      providers: [
        { provide: ProduitService, useValue: mockProduitService },
        { provide: CategorieService, useValue: mockCategorieService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitList);
    component = fixture.componentInstance;
  });

  it('devrait charger les produits et les catégories au démarrage', () => {
    fixture.detectChanges();

    expect(mockProduitService.getProduits).toHaveBeenCalled();
    expect(mockCategorieService.getCategories).toHaveBeenCalled();
    expect(component.categories().length).toBe(1);
  });

  it('devrait appeler saveProduit et réinitialiser le formulaire après ajout', () => {
    fixture.detectChanges();

    const produitAEnregistrer = {
      nom: 'Laque',
      description: 'Fixation forte',
      prixUnitaire: 15,
      quantite: 10,
      seuilAlerte: 2,
      categorie: { id: 1 } as any
    };
    component.nouveauProduit = produitAEnregistrer;

    mockProduitService.saveProduit.mockReturnValue(of({ id: 123, ...produitAEnregistrer }));

    const spyCharger = vi.spyOn(component, 'chargerProduits');

    component.ajouterProduit();

    expect(mockProduitService.saveProduit).toHaveBeenCalledWith(produitAEnregistrer);
    expect(spyCharger).toHaveBeenCalled();

    expect(component.nouveauProduit.nom).toBe('');
    expect(component.nouveauProduit.seuilAlerte).toBe(5);
  });
});
