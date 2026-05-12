import { Routes } from '@angular/router';
import {ClientList} from './components/client-list/client-list';
import {ProduitList} from './components/produit-list/produit-list';
import {Agenda} from './components/agenda/agenda';
import {Dashboard} from './components/dashboard/dashboard/dashboard';

export const routes: Routes = [
  { path: 'clients', component: ClientList },
  { path: 'produits', component: ProduitList },
  { path: 'agenda', component: Agenda },
  { path: 'dashboard', component: Dashboard },
  { path: '', redirectTo: '/clients', pathMatch: 'full' }
];
