import {Component, OnInit, signal} from '@angular/core';
import {ClientService} from '../../services/client/client';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-client-list',
  imports: [FormsModule],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css',
})
export class ClientList implements OnInit {
  clients= signal<any[]>([]); // On stockera nos clients ici
  nouveauClient = {
    nom: '',
    email: '',
    telephone: '',
    pointsFidelite: 0
  };

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.chargerClients();
  }

  chargerClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients.set(data);
        console.log('Clients chargés :', data);
      },
      error: (err) => console.error('Erreur lors du chargement', err)
    });
  }

  ajouterClient(): void {
    this.clientService.saveClient(this.nouveauClient).subscribe({
      next: () => {
        this.chargerClients(); // Rafraîchit la liste
        this.nouveauClient = { nom: '', email: '', telephone: '', pointsFidelite: 0 }; // Reset
        // Ici, on pourrait ajouter une fermeture de modale via JS
      },
      error: (err) => console.error('Erreur lors de l\'ajout', err)
    });
  }
}
