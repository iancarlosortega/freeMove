import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @Output() isLoading: EventEmitter<boolean> = new EventEmitter();
  isPhone: boolean = false;
  isHome: boolean = false;
  showMenu: boolean = false;

  constructor(
    private breakpointObs: BreakpointObserver,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.router.url === '/') {
      this.isHome = true;
    } else {
      this.isHome = false;
    }
  }

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

  navigateToDashboard() {
    this.isLoading.emit(true);
    this.router.navigateByUrl('/dashboard');
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
