import {Component, OnInit, signal} from '@angular/core';
import {RendezVousService} from '../../services/rendez-vous/rendez-vous';
import {ClientService} from '../../services/client/client';
import {StatutRendezVousService} from '../../services/statut-rendez-vous/statut-rendez-vous';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgClass} from '@angular/common';
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
  rendezVous = signal<any[]>([]);
  clients = signal<any[]>([]);
  statut = signal<any[]>([]);

  nouveauRdv : any = {
    dateHeure: '',
    client: null,
    statut: null
  };

  constructor(private rdvService: RendezVousService,
               private clientService : ClientService,
               private statutService: StatutRendezVousService){}


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
        this.nouveauRdv = data[0];
      }
    });
  }

  ajouterRdv() : void{
    console.log("AJOUTER RDV => ", this.nouveauRdv);
    const rdvAEnvoyer = {
      dateHeure: this.nouveauRdv.dateHeure,
      client: { id: this.nouveauRdv.client?.id }, // On n'envoie que l'ID
      statut: { id: this.nouveauRdv.statut.id }  // On n'envoie que l'ID
    };
    this.rdvService.saveRendezVous(rdvAEnvoyer).subscribe({
      next: data => {
        this.chargerDonnees();
        this.nouveauRdv= {dateHeure: '', client : null , statut: this.statut()[0]}
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


}
