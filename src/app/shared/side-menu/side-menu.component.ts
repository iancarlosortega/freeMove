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
  isEmailProvider: boolean = false;
  menuItems: any = [];

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$.subscribe((user) => {
      this.isAdmin = user.role === 'ADMIN-ROLE';
      this.isEmailProvider = user.provider === 'email-password';
      const menuItems = [
        {
          title: '',
          available: true,
          subItems: [
            {
              name: 'Dashboard',
              icon: 'assets/icons/dashboard.svg',
              route: './',
              available: true,
            },
            {
              name: 'Rutas',
              icon: 'assets/icons/rutas.svg',
              route: './rutas',
              available: true,
            },
            {
              name: 'Bitácora',
              icon: 'assets/icons/bitacora.svg',
              route: './bitacora',
              available: true,
            },
            {
              name: 'Incidentes',
              icon: 'assets/icons/incidentes.svg',
              route: './incidentes',
              available: true,
            },
            {
              name: 'Comunidad',
              icon: 'assets/icons/comunidad.svg',
              route: './comunidad',
              available: true,
            },
          ],
        },
        {
          title: 'Administración',
          available: this.isAdmin,
          subItems: [
            {
              name: 'Usuarios',
              icon: 'assets/icons/usuarios.svg',
              route: './admin/usuarios',
              available: true,
            },
            {
              name: 'Rutas',
              icon: 'assets/icons/rutas.svg',
              route: './admin/rutas',
              available: true,
            },
            {
              name: 'Incidentes',
              icon: 'assets/icons/incidentes.svg',
              route: './admin/incidentes',
              available: true,
            },
          ],
        },
        {
          title: 'Configuración',
          available: true,
          subItems: [
            {
              name: 'Perfil',
              icon: 'assets/icons/perfil.svg',
              route: './perfil',
              available: true,
            },
            {
              name: 'Email',
              icon: 'assets/icons/email.svg',
              route: './cambiar-correo',
              available: this.isEmailProvider,
            },
            {
              name: 'Contraseña',
              icon: 'assets/icons/clave.svg',
              route: './cambiar-clave',
              available: this.isEmailProvider,
            },
          ],
        },
      ];
      this.menuItems = menuItems;
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
