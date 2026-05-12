import {Component, inject, OnInit, signal} from '@angular/core';
import {DashboardService} from '../../../services/dashboard/dashboard';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private dashboardService = inject(DashboardService);

  stats = signal<any>(null);

  ngOnInit(){
    this.dashboardService.getStats().subscribe(data => {
      this.stats.set(data);
    })
  }
}
