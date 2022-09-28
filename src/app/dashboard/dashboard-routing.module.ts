import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard, ProviderGuard } from '../guards';
import { SearchComponent } from './search/search.component';

import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CommunityComponent } from './community/community.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { IncidentComponent } from './incident/incident.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { LinkAccountComponent } from './link-account/link-account.component';
import { LinkAccountInvitationComponent } from './link-account-invitation/link-account-invitation.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ProfileComponent } from './profile/profile.component';
import { RouteComponent } from './route/route.component';
import { RoutesComponent } from './routes/routes.component';
import { StadisticsComponent } from './stadistics/stadistics.component';
import { TrackingComponent } from './tracking/tracking.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { breadcrumb: 'Dashboard' },
    children: [
      {
        path: '',
        component: HomeComponent,
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
        component: StadisticsComponent,
        data: { breadcrumb: 'Bitácora' },
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
        path: 'perfil',
        component: ProfileComponent,
        data: { breadcrumb: 'Editar Perfil' },
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
        path: 'notificaciones',
        component: NotificationsComponent,
        data: { breadcrumb: 'Notificaciones' },
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
