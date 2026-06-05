import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DashboardService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait envoyer une requête GET et renvoyer les statistiques du tableau de bord', () => {
    const statsSimulees = {
      totalClients: 120,
      totalProduits: 45,
      rendezVousAujourdHui: 12
    };

    service.getStats().subscribe((data) => {
      expect(data).toEqual(statsSimulees);
      expect(data.totalClients).toBe(120);
    });

    const req = httpMock.expectOne('http://127.0.0.1:8081/api/dashboard/stats');
    expect(req.request.method).toBe('GET');

    req.flush(statsSimulees);
  });
});
