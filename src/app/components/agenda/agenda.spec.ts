import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Agenda } from './agenda';
import { RendezVousService } from '../../services/rendez-vous/rendez-vous';
import { ClientService } from '../../services/client/client';
import { StatutRendezVousService } from '../../services/statut-rendez-vous/statut-rendez-vous';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { describe, it, expect, vi, beforeEach } from 'vitest';

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
    getClients: vi.fn()
  };
  const statutServiceMock = {
    getStatus: vi.fn()
  };

  beforeEach(async () => {
    rdvServiceMock.getRendezVous.mockReturnValue(of([]));
    rdvServiceMock.saveRendezVous.mockReturnValue(of({id: 99}));
    rdvServiceMock.honorerRdv.mockReturnValue(of({}));
    rdvServiceMock.deleteRendezvous.mockReturnValue(of(null));

    clientServiceMock.getClients.mockReturnValue(of([{id: 1, nom: 'Doe'}]));
    statutServiceMock.getStatus.mockReturnValue(of([{id: 1, libelle: 'En attente'}]));

    await TestBed.configureTestingModule({
      imports: [Agenda, FormsModule],
      providers: [
        {provide: RendezVousService, useValue: rdvServiceMock},
        {provide: ClientService, useValue: clientServiceMock},
        {provide: StatutRendezVousService, useValue: statutServiceMock}
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
      statut: {id: 1}
    };

    component.ajouterRdv();

    expect(rdvServiceMock.saveRendezVous).toHaveBeenCalledWith(expect.objectContaining({
      dateHeure: '2026-05-12T10:00'
    }));
    expect(rdvServiceMock.getRendezVous.mock.calls.length).toBeGreaterThanOrEqual(2);
  }); // <--- C'est ici que l'accolade manquait !

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
});
