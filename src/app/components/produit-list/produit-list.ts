import {Component, signal} from '@angular/core';
import {ProduitService} from '../../services/produit/produit';
import {CategorieService} from '../../services/categorie/categorie';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-produit-list',
  imports: [
    FormsModule
  ],
  templateUrl: './produit-list.html',
  styleUrl: './produit-list.css',
})
export class ProduitList {
  produits = signal<any[]>([]) // On stockera nos clients ici
  categories = signal<any[]>([]);

  nouveauProduit: {
    nom: string;
    description: string;
    prixUnitaire: number;
    quantite: number;
    seuilAlerte: number;
    categorie: { id: number | null }
  } = {
    nom: '',
    description: '',
    prixUnitaire: 0,
    quantite: 0,
    seuilAlerte: 5,
    categorie: {id: null}
  };

  constructor(private produitService: ProduitService,private categorieService: CategorieService) {}

  ngOnInit(): void {
    this.chargerProduits();
    this.chargerCategories();
  }

  chargerProduits(): void {
    this.produitService.getProduits().subscribe({
      next: (data) => {
        this.produits.set(data);
        console.log('Produit chargés :', data);
      },
      error: (err) => console.error('Erreur lors du chargement', err)
    });
  }

  chargerCategories(): void {
    this.categorieService.getCategories().subscribe(data => this.categories.set(data));
  }

  ajouterProduit(): void {
    this.produitService.saveProduit(this.nouveauProduit).subscribe({
      next: () => {
        this.chargerProduits();
        this.nouveauProduit = { nom: '', description: '', prixUnitaire: 0, quantite: 0, seuilAlerte: 5, categorie: {id: null} };
      },
      error: (err) => console.error('Erreur ajout produit', err)
    });
  }
}
