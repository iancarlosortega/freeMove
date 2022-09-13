import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription, switchMap, tap } from 'rxjs';
import { User } from 'src/app/interfaces';
import { AuthService, AlertService, UserService } from 'src/app/services';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent implements OnInit, OnDestroy {
  @Output() onCloseSidenav: EventEmitter<any> = new EventEmitter();
  userObs!: Subscription;
  user!: User;
  idAlert: string = '';
  isAdmin: boolean = false;
  isEmailProvider: boolean = false;
  isAlertActive: boolean = false;
  menuItems: any = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private securityService: AlertService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$
      .pipe(
        tap((user) => (this.user = user)),
        switchMap((user) => this.securityService.getAlertByUser(user.idUser))
      )
      .subscribe((alert) => {
        if (alert && alert.isActive) {
          this.isAlertActive = true;
          this.idAlert = alert.idAlert;
        }
        this.isAdmin = this.user.role === 'ADMIN-ROLE';
        this.isEmailProvider = this.user.provider === 'email-password';
        const menuItems = [
          {
            title: '',
            isAvailable: true,
            subItems: [
              {
                name: 'Dashboard',
                icon: 'assets/icons/dashboard.svg',
                route: './',
                isAvailable: true,
              },
              {
                name: 'Rutas',
                icon: 'assets/icons/rutas.svg',
                route: './rutas',
                isAvailable: true,
              },
              {
                name: 'Bitácora',
                icon: 'assets/icons/bitacora.svg',
                route: './bitacora',
                isAvailable: true,
              },
              {
                name: 'Incidentes',
                icon: 'assets/icons/incidentes.svg',
                route: './incidentes',
                isAvailable: true,
              },
              {
                name: 'Comunidad',
                icon: 'assets/icons/comunidad.svg',
                route: './comunidad',
                isAvailable: true,
              },
            ],
          },
          {
            title: 'Administración',
            isAvailable: this.isAdmin,
            subItems: [
              {
                name: 'Usuarios',
                icon: 'assets/icons/usuarios.svg',
                route: './admin/usuarios',
                isAvailable: true,
              },
              {
                name: 'Rutas',
                icon: 'assets/icons/rutas.svg',
                route: './admin/rutas',
                isAvailable: true,
              },
              {
                name: 'Incidentes',
                icon: 'assets/icons/incidentes.svg',
                route: './admin/incidentes',
                isAvailable: true,
              },
            ],
          },
          {
            title: 'Configuración',
            isAvailable: true,
            subItems: [
              {
                name: 'Perfil',
                icon: 'assets/icons/perfil.svg',
                route: './perfil',
                isAvailable: true,
              },
              {
                name: 'Vincular cuenta',
                icon: 'assets/icons/link-account.svg',
                route: './vincular-cuenta',
                isAvailable: true,
              },
              {
                name: 'Email',
                icon: 'assets/icons/email.svg',
                route: './cambiar-correo',
                isAvailable: this.isEmailProvider,
              },
              {
                name: 'Contraseña',
                icon: 'assets/icons/clave.svg',
                route: './cambiar-clave',
                isAvailable: this.isEmailProvider,
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

  closeMenu() {
    this.onCloseSidenav.emit();
  }

  activateAlert() {
    this.onCloseSidenav.emit();
    this.securityService.activateAlert(this.user.idUser);
  }

  desactivateAlert() {
    this.securityService.desactivateAlert(this.idAlert);
  }
}
