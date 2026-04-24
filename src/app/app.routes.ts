import { Routes } from '@angular/router';
import {ClientList} from './components/client-list/client-list';
import {ProduitList} from './components/produit-list/produit-list';

export const routes: Routes = [
  { path: 'clients', component: ClientList },
  { path: 'produits', component: ProduitList }, // On changera quand le composant existera
  { path: 'agenda', component: ClientList },   // Idem
  { path: '', redirectTo: '/clients', pathMatch: 'full' } // Redirection par défaut
];
