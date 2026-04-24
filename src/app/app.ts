import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ClientList} from './components/client-list/client-list';
import {Navbar} from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ClientList, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('shopwise-front');
}
