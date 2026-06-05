import {Component, OnInit, signal} from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterModule} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {

  static currentRole = signal<'COMMERCANT' | 'CLIENT'>('COMMERCANT') ;

  constructor(private router: Router) {
  }
  ngOnInit() : void {}

  get role() {
    return Navbar.currentRole() ;
  }

  changerRole(nouveauRole: 'COMMERCANT' | 'CLIENT') {
    Navbar.currentRole.set(nouveauRole);
    if (nouveauRole === 'CLIENT') {
      const urlActuelle = this.router.url;

      if (urlActuelle.includes('/dashboard') || urlActuelle.includes('/clients') || urlActuelle.includes('/produits')) {
        this.router.navigate(['/agenda']);
      }
    }
  }
}
