import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit {
  @Output() onCloseSidenav: EventEmitter<any> = new EventEmitter();

  // Menus
  menuItems = [
    {
      name: 'Dashboard',
      icon: 'assets/icons/dashboard.svg',
      route: './',
    },
    {
      name: 'Rutas',
      icon: 'assets/icons/rutas.svg',
      route: './rutas',
    },
    {
      name: 'Bitácora',
      icon: 'assets/icons/bitacora.svg',
      route: './bitacora',
    },
    {
      name: 'Incidentes',
      icon: 'assets/icons/incidentes.svg',
      route: './incidentes',
    },
    {
      name: 'Comunidad',
      icon: 'assets/icons/comunidad.svg',
      route: './comunidad',
    },
  ];
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  cerrarSidenav() {
    this.onCloseSidenav.emit();
  }
}
