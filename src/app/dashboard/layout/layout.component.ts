import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements AfterViewInit {
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  isPhone: boolean = true;

  constructor(private observer: BreakpointObserver) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.observer.observe(['(max-width: 992px)']).subscribe((res) => {
        if (res.matches) {
          this.isPhone = true;
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.isPhone = false;
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
    }, 0);
  }

  closeSidenav() {
    if (this.isPhone) {
      this.sidenav.mode = 'over';
      this.sidenav.close();
    }
  }
}
