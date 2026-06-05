import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { DashboardService } from '../../../services/dashboard/dashboard';
import { of } from 'rxjs';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Dashboard (Component)', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  const dashboardServiceMock = {
    getStats: vi.fn()
  };

  beforeEach(async () => {
    // Valeur de retour par défaut pour le bon déroulement de l'initialisation
    dashboardServiceMock.getStats.mockReturnValue(of({ totalClients: 15, totalRendezVous: 42 }));

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });


  it('devrait créer le composant', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('devrait charger les statistiques du tableau de bord à l’initialisation', () => {
    const statsSimulees = {
      clientsActifs: 50,
      rdvAujourdhui: 8,
      chiffreAffaires: 1200
    };

    dashboardServiceMock.getStats.mockReturnValue(of(statsSimulees));

    fixture.detectChanges();

    expect(dashboardServiceMock.getStats).toHaveBeenCalled();
    expect(component.stats()).toEqual(statsSimulees);
  });
});
