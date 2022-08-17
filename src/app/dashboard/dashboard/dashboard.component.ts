import { Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  phone: boolean = true;

  constructor(private observer: BreakpointObserver) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(max-width: 768px)']).subscribe((res) => {
        if (res.matches) {
          this.phone = true;
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.phone = false;
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
    }, 0);
  }

  closeSidenav() {
    if (this.phone) {
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }
  }
}
