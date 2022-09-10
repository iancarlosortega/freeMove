import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuard, ProviderGuard } from '../guards';

import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { CommunityComponent } from './community/community.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { LinkAccountComponent } from './link-account/link-account.component';
import { ProfileComponent } from './profile/profile.component';
import { RouteComponent } from './route/route.component';
import { RoutesComponent } from './routes/routes.component';

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
            data: { breadcrumb: 'Gestión de Ruta' },
          },
        ],
      },
      //TODO: Agregar componente de bitácora
      {
        path: 'bitacora',
        component: HomeComponent,
      },
      {
        path: 'incidentes',
        component: IncidentsComponent,
        data: { breadcrumb: 'Incidentes' },
      },
      {
        path: 'comunidad',
        component: CommunityComponent,
        data: { breadcrumb: 'Comunidad' },
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
