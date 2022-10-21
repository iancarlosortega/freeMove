import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription, switchMap, tap } from 'rxjs';
import { Alert, User } from 'src/app/interfaces';
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
  alert!: Alert;
  isAdmin: boolean = false;
  isEmailProvider: boolean = false;
  menuItems: any = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$
      .pipe(
        tap((user) => (this.user = user)),
        switchMap((user) => this.alertService.getAlertByUser(user.idUser))
      )
      .subscribe((alert) => {
        this.alert = alert;
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
                icon: 'assets/icons/routes.svg',
                route: './rutas',
                isAvailable: true,
              },
              {
                name: 'Galería',
                icon: 'assets/icons/gallery.svg',
                route: './galeria',
                isAvailable: true,
              },
              {
                name: 'Salud',
                icon: 'assets/icons/health.svg',
                route: './salud',
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
                icon: 'assets/icons/incidents.svg',
                route: './incidentes',
                isAvailable: true,
              },
              {
                name: 'Comunidad',
                icon: 'assets/icons/community.svg',
                route: './comunidad',
                isAvailable: true,
              },
              {
                name: 'Rastreo',
                icon: 'assets/icons/tracking.svg',
                route: './rastreo',
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
                icon: 'assets/icons/users.svg',
                route: './admin/usuarios',
                isAvailable: true,
              },
              {
                name: 'Rutas',
                icon: 'assets/icons/routes.svg',
                route: './admin/rutas',
                isAvailable: true,
              },
              {
                name: 'Incidentes',
                icon: 'assets/icons/incidents.svg',
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
                name: 'Ajustes',
                icon: 'assets/icons/settings.svg',
                route: './ajustes',
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
                icon: 'assets/icons/password.svg',
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
    this.alertService.activateAlert(this.user.idUser);
  }

  desactivateAlert() {
    this.onCloseSidenav.emit();
    this.alertService.desactivateAlert(this.alert);
  }
}
