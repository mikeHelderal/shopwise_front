import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { Router, ActivatedRoute } from '@angular/router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Subject, of } from 'rxjs';

describe('Navbar (Component)', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  // Un Subject pour simuler le flux d'événements du Router
  const routerEvents = new Subject();

  const routerMock = {
    navigate: vi.fn(),
    url: '/dashboard',
    // RouterLinkActive a besoin de cette propriété 'events'
    events: routerEvents.asObservable()
  };

  const activatedRouteMock = {
    snapshot: {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;

    Navbar.currentRole.set('COMMERCANT');
    routerMock.navigate.mockClear();
  });

  it('devrait créer le composant', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('devrait retourner le rôle actuel via le getter role', () => {
    Navbar.currentRole.set('CLIENT');
    expect(component.role).toBe('CLIENT');
  });

  it('devrait changer le rôle en COMMERCANT et ne pas rediriger', () => {
    component.changerRole('COMMERCANT');
    expect(Navbar.currentRole()).toBe('COMMERCANT');
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('devrait rediriger vers /agenda si le rôle devient CLIENT', () => {
    routerMock.url = '/dashboard';
    component.changerRole('CLIENT');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/agenda']);
  });
});
