import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardService } from '../../services/dashboard/dashboard';
import { of } from 'rxjs';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import {Dashboard} from '../../components/dashboard/dashboard/dashboard';

describe('Dashboard (Component)', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  const mockDashboardService = {
    getStats: vi.fn()
  };

  beforeEach(async () => {
    mockDashboardService.getStats.mockReturnValue(of({
      totalClients: 15,
      rdvDuJour: 8,
      produitsEnAlerte: 3
    }));

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
  });

  it('devrait être créé', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('devrait charger les statistiques via le mock', () => {
    fixture.detectChanges();

    expect(mockDashboardService.getStats).toHaveBeenCalled();
    expect(component.stats()?.totalClients).toBe(15);
  });
});
