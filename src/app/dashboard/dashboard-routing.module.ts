import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard, ProviderGuard } from '../guards';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { BitacoraComponent } from './bitacora/bitacora.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CommunityComponent } from './community/community.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HealthComponent } from './health/health.component';
import { IncidentComponent } from './incident/incident.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { LayoutComponent } from './layout/layout.component';
import { LinkAccountComponent } from './link-account/link-account.component';
import { LinkAccountInvitationComponent } from './link-account-invitation/link-account-invitation.component';
import { ProfileComponent } from './profile/profile.component';
import { RouteComponent } from './route/route.component';
import { RoutesComponent } from './routes/routes.component';
import { SearchComponent } from './search/search.component';
import { TrackingComponent } from './tracking/tracking.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    data: { breadcrumb: 'Dashboard' },
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: { breadcrumb: '' },
      },
      {
        path: 'buscar',
        component: SearchComponent,
        data: { breadcrumb: 'Búsqueda' },
      },
      {
        path: 'rutas',
        data: { breadcrumb: 'Historial de Rutas' },
        children: [
          {
            path: '',
            component: RoutesComponent,
            data: { breadcrumb: '' },
          },
          {
            path: ':id',
            component: RouteComponent,
            data: { breadcrumb: 'Estadísticas de la Ruta' },
          },
        ],
      },
      {
        path: 'bitacora',
        component: BitacoraComponent,
        data: { breadcrumb: 'Bitácora' },
      },
      {
        path: 'galeria',
        component: GalleryComponent,
        data: { breadcrumb: 'Galería de Fotos' },
      },
      {
        path: 'salud',
        component: HealthComponent,
        data: { breadcrumb: 'Niveles de Salud' },
      },
      {
        path: 'incidentes',
        data: { breadcrumb: 'Incidentes' },
        children: [
          {
            path: '',
            component: IncidentsComponent,
            data: { breadcrumb: '' },
          },
          {
            path: ':id',
            component: IncidentComponent,
            data: { breadcrumb: 'Gestión de Incidente' },
          },
        ],
      },
      {
        path: 'comunidad',
        component: CommunityComponent,
        data: { breadcrumb: 'Comunidad' },
      },
      {
        path: 'rastreo',
        component: TrackingComponent,
        data: { breadcrumb: 'Rastrear Ubicación' },
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('../admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AdminGuard],
        canLoad: [AdminGuard],
      },
      {
        path: 'ajustes',
        component: AccountSettingsComponent,
        data: { breadcrumb: 'Ajustes de la Cuenta' },
      },
      {
        path: 'cambiar-clave',
        component: ChangePasswordComponent,
        data: { breadcrumb: 'Cambiar Contraseña' },
        canActivate: [ProviderGuard],
        canLoad: [ProviderGuard],
      },
      {
        path: 'cambiar-correo',
        component: ChangeEmailComponent,
        data: { breadcrumb: 'Cambiar Correo Electrónico' },
        canActivate: [ProviderGuard],
        canLoad: [ProviderGuard],
      },
      {
        path: 'vincular-cuenta',
        component: LinkAccountComponent,
        data: { breadcrumb: 'Vincular Cuenta' },
      },
      {
        path: 'invitacion-vinculamiento/:id',
        component: LinkAccountInvitationComponent,
        data: { breadcrumb: 'Invitación de Vinculamiento de Cuenta' },
      },
      {
        path: 'usuario/:id',
        component: ProfileComponent,
        data: { breadcrumb: 'Perfil de Usuario' },
      },
      {
        path: '**',
        redirectTo: 'home',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
