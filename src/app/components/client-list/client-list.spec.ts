import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientList } from './client-list';
import { ClientService } from '../../services/client/client';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { vi } from 'vitest';

describe('ClientList (Component)', () => {
  let component: ClientList;
  let fixture: ComponentFixture<ClientList>;

  const mockClientService = {
    getClients: vi.fn(),
    saveClient: vi.fn()
  };

  beforeEach(async () => {
    mockClientService.getClients.mockReturnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [ClientList, FormsModule],
      providers: [
        { provide: ClientService, useValue: mockClientService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientList);
    component = fixture.componentInstance;
  });

  it('devrait charger la liste des clients', () => {
    const data = [{ id: 1, nom: 'Alice' }];
    mockClientService.getClients.mockReturnValue(of(data));

    fixture.detectChanges();

    expect(component.clients()).toEqual(data);
    expect(mockClientService.getClients).toHaveBeenCalled();
  });
});
