import {Component, computed, OnInit, signal} from '@angular/core';
import {RendezVousService} from '../../services/rendez-vous/rendez-vous';
import {ClientService} from '../../services/client/client';
import {StatutRendezVousService} from '../../services/statut-rendez-vous/statut-rendez-vous';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgClass} from '@angular/common';
import {ProduitService} from '../../services/produit/produit';
import {Navbar} from '../navbar/navbar';
interface ItemWithId {
  id: number;
  [key: string]: any;
}

@Component({
  selector: 'app-agenda',
  imports: [
    FormsModule,
    NgClass,
    DatePipe
  ],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda implements OnInit {
  protected readonly Navbar = Navbar;

  rendezVous = signal<any[]>([]);
  clients = signal<any[]>([]);
  statut = signal<any[]>([]);
  produits = signal<any[]>([]);

  clientConnecte = signal<any>(null);
  emailSaisi: string = '';

  rendezVousFiltres = computed(() => {
    if (this.currentRole === 'COMMERCANT') {
      return this.rendezVous();
    }
    const client = this.clientConnecte();
    return client ? this.rendezVous().filter(r => r.client?.id === client.id) : [];
  });

  nouveauRdv : any = {
    dateHeure: '',
    client: null,
    statut: null,
    produit: null
  };

  constructor(private rdvService: RendezVousService,
               private clientService : ClientService,
               private statutService: StatutRendezVousService,
              private produitService: ProduitService){}


  get currentRole() {
    return Navbar.currentRole();
  }
  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.rdvService.getRendezVous().subscribe(data => {
      console.log(data);
      this.rendezVous.set(data)
    });
    this.clientService.getClients().subscribe(data => this.clients.set(data));
    this.statutService.getStatus().subscribe(data => {
      this.statut.set(data);
      if(data.length > 0){
        this.nouveauRdv.statut = data[0];
      }
    })
    this.produitService.getProduits().subscribe((data : any) => this.produits.set(data));
  }

  ajouterRdv() : void{
    console.log("AJOUTER RDV => ", this.nouveauRdv);
    const rdvAEnvoyer = {
      dateHeure: this.nouveauRdv.dateHeure,
      client: { id: this.nouveauRdv.client?.id },
      statut: { id: this.nouveauRdv.statut.id } ,
      produit: {id: this.nouveauRdv.produit.id}
    };
    this.rdvService.saveRendezVous(rdvAEnvoyer).subscribe({
      next: data => {
        this.chargerDonnees();
        this.nouveauRdv= {dateHeure: '', client : null , statut: this.statut()[0], produit : null}
      }
    });
  }

  validerRdv(id: number) {
    this.rdvService.honorerRdv(id).subscribe({
      next: () => {
        this.chargerDonnees();
        alert("Rendez-vous honoré ! 10 point ajoutés au client.");
      }
    });
  }

  annulerRdv(id: number): void {
    if(confirm('Voulez-vous vraiment annuler ce rendez-vous ?')) {
      this.rdvService.deleteRendezvous(id).subscribe({
        next: () => {
          this.rendezVous.set(this.rendezVous().filter(r => r.id !== id));
        },
        error: (err) => console.error("Erreur lors de l'annulation", err)
      });
    }
  }

  identifierClient(): void {
    if (!this.emailSaisi.trim()) return;

    this.clientService.getClientByEmail(this.emailSaisi.trim()).subscribe({
      next: (clientRecupere) => {
        this.clientConnecte.set(clientRecupere);
      },
      error: (err) => {
        console.error(err);
        alert("Aucun client n'est enregistré avec cette adresse email.");
      }
    });
  }

  deconnecterClient(): void {
    this.clientConnecte.set(null);
    this.emailSaisi = '';
  }

}
