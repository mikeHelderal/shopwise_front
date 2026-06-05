import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Agenda } from './agenda';
import { RendezVousService } from '../../services/rendez-vous/rendez-vous';
import { ClientService } from '../../services/client/client';
import { StatutRendezVousService } from '../../services/statut-rendez-vous/statut-rendez-vous';
import { ProduitService } from '../../services/produit/produit';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Navbar } from '../navbar/navbar';

describe('Agenda (Component)', () => {
  let component: Agenda;
  let fixture: ComponentFixture<Agenda>;

  const rdvServiceMock = {
    getRendezVous: vi.fn(),
    saveRendezVous: vi.fn(),
    honorerRdv: vi.fn(),
    deleteRendezvous: vi.fn()
  };
  const clientServiceMock = {
    getClients: vi.fn(),
    getClientByEmail: vi.fn()
  };
  const statutServiceMock = {
    getStatus: vi.fn()
  };
  const produitServiceMock = {
    getProduits: vi.fn()
  };

  beforeEach(async () => {
    vi.clearAllMocks();


    rdvServiceMock.getRendezVous.mockReturnValue(of([]));
    rdvServiceMock.saveRendezVous.mockReturnValue(of({id: 99}));
    rdvServiceMock.honorerRdv.mockReturnValue(of({}));
    rdvServiceMock.deleteRendezvous.mockReturnValue(of(null));

    clientServiceMock.getClients.mockReturnValue(of([{id: 1, nom: 'Doe'}]));
    clientServiceMock.getClientByEmail.mockReturnValue(of({id: 1, nom: 'Doe', email: 'doe@shopwise.com'}));
    statutServiceMock.getStatus.mockReturnValue(of([{id: 1, libelle: 'En attente'}]));
    produitServiceMock.getProduits.mockReturnValue(of([{id: 1, nom: 'Coupe Homme', prixUnitaire: 25}]));

    vi.spyOn(Navbar, 'currentRole').mockReturnValue('COMMERCANT');

    await TestBed.configureTestingModule({
      imports: [Agenda, FormsModule],
      providers: [
        {provide: RendezVousService, useValue: rdvServiceMock},
        {provide: ClientService, useValue: clientServiceMock},
        {provide: StatutRendezVousService, useValue: statutServiceMock},
        {provide: ProduitService, useValue: produitServiceMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Agenda);
    component = fixture.componentInstance;
  });

  it('devrait charger les données (RDV, Clients, Statuts) à l’initialisation', () => {
    fixture.detectChanges();
    expect(rdvServiceMock.getRendezVous).toHaveBeenCalled();
    expect(clientServiceMock.getClients).toHaveBeenCalled();
    expect(statutServiceMock.getStatus).toHaveBeenCalled();
    expect(component.clients().length).toBe(1);
  });

  it('devrait appeler saveRendezVous lors de l’ajout d’un rendez-vous', () => {
    fixture.detectChanges();
    component.nouveauRdv = {
      dateHeure: '2026-05-12T10:00',
      client: {id: 1},
      statut: {id: 1},
      produit: {id: 1}
    };

    component.ajouterRdv();

    expect(rdvServiceMock.saveRendezVous).toHaveBeenCalledWith(expect.objectContaining({
      dateHeure: '2026-05-12T10:00'
    }));
    expect(rdvServiceMock.getRendezVous.mock.calls.length).toBeGreaterThanOrEqual(1);
  });

  it('devrait supprimer un rendez-vous après confirmation', () => {
    fixture.detectChanges();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    component.annulerRdv(1);

    expect(rdvServiceMock.deleteRendezvous).toHaveBeenCalledWith(1);
    confirmSpy.mockRestore();
  });

  it('devrait honorer un rendez-vous et afficher une alerte', () => {
    fixture.detectChanges();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    component.validerRdv(1);

    expect(rdvServiceMock.honorerRdv).toHaveBeenCalledWith(1);
    expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Rendez-vous honoré'));
    alertSpy.mockRestore();
  });

  it('devrait afficher tous les rendez-vous si le rôle est COMMERCANT', () => {
    vi.spyOn(Navbar, 'currentRole').mockReturnValue('COMMERCANT');
    const rdvList = [{ id: 1, client: { id: 1 } }, { id: 2, client: { id: 2 } }];
    rdvServiceMock.getRendezVous.mockReturnValue(of(rdvList));

    fixture.detectChanges();

    expect(component.rendezVousFiltres()).toEqual(rdvList);
  });

  it('devrait filtrer les rendez-vous par client si le rôle est CLIENT', () => {
    vi.spyOn(Navbar, 'currentRole').mockReturnValue('CLIENT');
    const rdvList = [
      { id: 1, client: { id: 1 } },
      { id: 2, client: { id: 2 } }
    ];
    rdvServiceMock.getRendezVous.mockReturnValue(of(rdvList));

    fixture.detectChanges();
    component.clientConnecte.set({ id: 1, nom: 'Doe' });

    expect(component.rendezVousFiltres()).toEqual([{ id: 1, client: { id: 1 } }]);
  });

  it('devrait retourner un tableau vide si le rôle est CLIENT mais aucun client n’est connecté', () => {
    vi.spyOn(Navbar, 'currentRole').mockReturnValue('CLIENT');
    rdvServiceMock.getRendezVous.mockReturnValue(of([{ id: 1, client: { id: 1 } }]));

    fixture.detectChanges();
    component.clientConnecte.set(null);

    expect(component.rendezVousFiltres()).toEqual([]);
  });

  it('devrait ne pas planter si la liste des statuts reçue est vide', () => {
    statutServiceMock.getStatus.mockReturnValue(of([]));

    fixture.detectChanges();

    expect(component.statut()).toEqual([]);
    expect(component.nouveauRdv.statut).toBeNull();
  });

  it('devrait ne rien faire lors de l’annulation d’un rdv si l’utilisateur clique sur Annuler', () => {
    fixture.detectChanges();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.annulerRdv(1);

    expect(rdvServiceMock.deleteRendezvous).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('devrait intercepter et logger l’erreur en console lors de l’échec d’une annulation', () => {
    fixture.detectChanges();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    rdvServiceMock.deleteRendezvous.mockReturnValue(throwError(() => new Error('Erreur HTTP')));

    component.annulerRdv(1);

    expect(consoleSpy).toHaveBeenCalledWith("Erreur lors de l'annulation", expect.any(Error));
    consoleSpy.mockRestore();
  });

  it('devrait arrêter l’identification immédiatement si l’email saisi est vide ou constitué d’espaces', () => {
    fixture.detectChanges();
    component.emailSaisi = '   ';

    component.identifierClient();

    expect(clientServiceMock.getClientByEmail).not.toHaveBeenCalled();
  });

  it('devrait connecter le client avec succès si l’adresse email est valide', () => {
    fixture.detectChanges();
    component.emailSaisi = 'doe@shopwise.com';
    const clientData = { id: 1, nom: 'Doe', email: 'doe@shopwise.com' };
    clientServiceMock.getClientByEmail.mockReturnValue(of(clientData));

    component.identifierClient();

    expect(clientServiceMock.getClientByEmail).toHaveBeenCalledWith('doe@shopwise.com');
    expect(component.clientConnecte()).toEqual(clientData);
  });

  it('devrait afficher une alerte et logger l’erreur si l’adresse email n’est pas trouvée', () => {
    fixture.detectChanges();
    component.emailSaisi = 'inconnu@shopwise.com';
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    clientServiceMock.getClientByEmail.mockReturnValue(throwError(() => new Error('Not Found')));

    component.identifierClient();

    expect(consoleSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith("Aucun client n'est enregistré avec cette adresse email.");
    consoleSpy.mockRestore();
    alertSpy.mockRestore();
  });

  it('devrait vider la session client lors de la déconnexion', () => {
    fixture.detectChanges();
    component.clientConnecte.set({ id: 1, nom: 'Doe' });
    component.emailSaisi = 'doe@shopwise.com';

    component.deconnecterClient();

    expect(component.clientConnecte()).toBeNull();
    expect(component.emailSaisi).toBe('');
  });
});
