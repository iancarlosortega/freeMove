import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { CommunityComponent } from './community/community.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { RoutesComponent } from './routes/routes.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'rutas',
        component: RoutesComponent,
      },
      //TODO: Agregar componente de bitácora
      {
        path: 'bitacora',
        component: HomeComponent,
      },
      {
        path: 'incidentes',
        component: IncidentsComponent,
      },
      {
        path: 'comunidad',
        component: CommunityComponent,
      },
      {
        path: 'perfil',
        component: ProfileComponent,
      },
      {
        path: 'cambiar-clave',
        component: ChangePasswordComponent,
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
