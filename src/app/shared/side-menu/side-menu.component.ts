import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService, UserService } from 'src/app/services';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit, OnDestroy {
  @Output() onCloseSidenav: EventEmitter<any> = new EventEmitter();
  userObs!: Subscription;
  isAdmin: boolean = false;

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

  adminMenuItems = [
    {
      name: 'Usuarios',
      icon: 'assets/icons/usuarios.svg',
      route: './admin/usuarios',
    },
    {
      name: 'Rutas',
      icon: 'assets/icons/rutas.svg',
      route: './admin/rutas',
    },
    {
      name: 'Incidentes',
      icon: 'assets/icons/incidentes.svg',
      route: './admin/incidentes',
    },
  ];

  configMenuItems = [
    {
      name: 'Perfil',
      icon: 'assets/icons/perfil.svg',
      route: './perfil',
    },
    {
      name: 'Contraseña',
      icon: 'assets/icons/clave.svg',
      route: './cambiar-clave',
    },
  ];
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$.subscribe((user) => {
      this.isAdmin = user.role === 'ADMIN-ROLE';
    });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }

  logout() {
    this.authService.logout();
  }

  cerrarSidenav() {
    this.onCloseSidenav.emit();
  }
}
