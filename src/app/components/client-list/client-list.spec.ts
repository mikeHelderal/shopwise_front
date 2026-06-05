import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientList } from './client-list';
import { ClientService } from '../../services/client/client';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ClientList (Component)', () => {
  let component: ClientList;
  let fixture: ComponentFixture<ClientList>;

  const clientServiceMock = {
    getClients: vi.fn(),
    saveClient: vi.fn()
  };

  beforeEach(async () => {
    clientServiceMock.getClients.mockReturnValue(of([]));
    clientServiceMock.saveClient.mockReturnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [ClientList, FormsModule],
      providers: [
        { provide: ClientService, useValue: clientServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientList);
    component = fixture.componentInstance;
  });


  it('devrait créer le composant', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('devrait charger les clients avec succès à l’initialisation', () => {
    const clientsSimules = [
      { id: 1, nom: 'Jean Dupont', email: 'jean@test.com', telephone: '0601020304', pointsFidelite: 10 },
      { id: 2, nom: 'Marie Courtois', email: 'marie@test.com', telephone: '0605060708', pointsFidelite: 25 }
    ];
    clientServiceMock.getClients.mockReturnValue(of(clientsSimules));

    fixture.detectChanges(); // Déclenche ngOnInit -> chargerClients()

    expect(clientServiceMock.getClients).toHaveBeenCalled();
    expect(component.clients()).toEqual(clientsSimules);
  });

  it('devrait intercepter et logger l’erreur si le chargement des clients échoue', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    clientServiceMock.getClients.mockReturnValue(throwError(() => new Error('Erreur de serveur')));

    fixture.detectChanges();

    expect(clientServiceMock.getClients).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Erreur lors du chargement', expect.any(Error));
    consoleSpy.mockRestore();
  });


  it('devrait ajouter un client, rafraîchir la liste et réinitialiser le formulaire en cas de succès', () => {
    fixture.detectChanges(); // Premier chargement

    component.nouveauClient = {
      nom: 'Luc Martin',
      email: 'luc@martin.com',
      telephone: '0700000000',
      pointsFidelite: 0
    };

    clientServiceMock.saveClient.mockReturnValue(of({ id: 3, ...component.nouveauClient }));

    const chargerSpy = vi.spyOn(component, 'chargerClients');

    component.ajouterClient();

    expect(clientServiceMock.saveClient).toHaveBeenCalledWith({
      nom: 'Luc Martin',
      email: 'luc@martin.com',
      telephone: '0700000000',
      pointsFidelite: 0
    });
    expect(chargerSpy).toHaveBeenCalled();

    expect(component.nouveauClient).toEqual({
      nom: '',
      email: '',
      telephone: '',
      pointsFidelite: 0
    });

    chargerSpy.mockRestore();
  });

  it('devrait intercepter et logger l’erreur si l’ajout du client échoue', () => {
    fixture.detectChanges();
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    clientServiceMock.saveClient.mockReturnValue(throwError(() => new Error('Erreur de validation')));

    component.ajouterClient();

    expect(clientServiceMock.saveClient).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Erreur lors de l\'ajout', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
