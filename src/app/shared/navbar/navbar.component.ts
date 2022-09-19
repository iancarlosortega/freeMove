import { AfterViewInit, Component } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements AfterViewInit {
  isPhone: boolean = false;
  showMenu: boolean = false;

  constructor(private breakpointObs: BreakpointObserver) {}

  ngAfterViewInit() {
    setTimeout(() => {
      this.breakpointObs.observe(['(min-width: 768px)']).subscribe((res) => {
        if (res.matches) {
          this.isPhone = false;
        } else {
          this.isPhone = true;
        }
      });
    }, 0);
  }

  scrollToSection(elementId: string) {
    const element = document.getElementById(elementId);
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }
}
