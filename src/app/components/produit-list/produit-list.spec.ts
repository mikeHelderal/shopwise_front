import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProduitList } from './produit-list';
import { ProduitService } from '../../services/produit/produit';
import { CategorieService } from '../../services/categorie/categorie';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ProduitList (Component)', () => {
  let component: ProduitList;
  let fixture: ComponentFixture<ProduitList>;

  // ==========================================
  // CONFIGURATION : Mocks des services Produit et Categorie
  // ==========================================
  const produitServiceMock = {
    getProduits: vi.fn(),
    saveProduit: vi.fn()
  };

  const categorieServiceMock = {
    getCategories: vi.fn()
  };

  beforeEach(async () => {
    // Valeurs de retour par défaut pour l'initialisation du composant
    produitServiceMock.getProduits.mockReturnValue(of([]));
    produitServiceMock.saveProduit.mockReturnValue(of({}));
    categorieServiceMock.getCategories.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ProduitList, FormsModule],
      providers: [
        { provide: ProduitService, useValue: produitServiceMock },
        { provide: CategorieService, useValue: categorieServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitList);
    component = fixture.componentInstance;
  });

  // ==========================================
  // TESTS : Initialisation et Chargements
  // ==========================================

  it('devrait créer le composant', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('devrait charger les produits et catégories à l’initialisation avec succès', () => {
    const produitsSimules = [
      { id: 1, nom: 'Gel Coiffant', description: 'Fixation forte', prixUnitaire: 12.5, quantite: 20, seuilAlerte: 5 }
    ];
    const categoriesSimulees = [
      { id: 1, nom: 'Coiffure' },
      { id: 2, nom: 'Soins' }
    ];

    produitServiceMock.getProduits.mockReturnValue(of(produitsSimules));
    categorieServiceMock.getCategories.mockReturnValue(of(categoriesSimulees));

    fixture.detectChanges(); // Déclenche ngOnInit -> chargerProduits() et chargerCategories()

    expect(produitServiceMock.getProduits).toHaveBeenCalled();
    expect(categorieServiceMock.getCategories).toHaveBeenCalled();
    expect(component.produits()).toEqual(produitsSimules);
    expect(component.categories()).toEqual(categoriesSimulees);
  });

  it('devrait intercepter et logger l’erreur si le chargement des produits échoue', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    produitServiceMock.getProduits.mockReturnValue(throwError(() => new Error('Erreur serveur')));

    fixture.detectChanges();

    expect(produitServiceMock.getProduits).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Erreur lors du chargement', expect.any(Error));
    consoleSpy.mockRestore();
  });

  // ==========================================
  // TESTS : Ajout de produits
  // ==========================================

  it('devrait ajouter un produit, rafraîchir la liste et réinitialiser le formulaire en cas de succès', () => {
    fixture.detectChanges();

    // Simulation du remplissage du formulaire par l'utilisateur
    component.nouveauProduit = {
      nom: 'Cire Cheveux',
      description: 'Effet mat',
      prixUnitaire: 18,
      quantite: 15,
      seuilAlerte: 3,
      categorie: { id: 1 }
    };

    const chargerSpy = vi.spyOn(component, 'chargerProduits');
    produitServiceMock.saveProduit.mockReturnValue(of({ id: 9, nom: 'Cire Cheveux' }));

    component.ajouterProduit();

    expect(produitServiceMock.saveProduit).toHaveBeenCalledWith({
      nom: 'Cire Cheveux',
      description: 'Effet mat',
      prixUnitaire: 18,
      quantite: 15,
      seuilAlerte: 3,
      categorie: { id: 1 }
    });

    // Vérification du rechargement de la liste
    expect(chargerSpy).toHaveBeenCalled();

    // Vérification du Reset complet de l'objet (structure par défaut)
    expect(component.nouveauProduit).toEqual({
      nom: '',
      description: '',
      prixUnitaire: 0,
      quantite: 0,
      seuilAlerte: 5,
      categorie: { id: null }
    });

    chargerSpy.mockRestore();
  });

  it('devrait intercepter et logger l’erreur si l’ajout du produit échoue', () => {
    fixture.detectChanges();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    produitServiceMock.saveProduit.mockReturnValue(throwError(() => new Error('Erreur d’insertion')));

    component.ajouterProduit();

    expect(produitServiceMock.saveProduit).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Erreur ajout produit', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
