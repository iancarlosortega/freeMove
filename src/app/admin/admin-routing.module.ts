import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentsComponent } from './incidents/incidents.component';

import { RouteComponent } from './route/route.component';
import { RoutesComponent } from './routes/routes.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'usuarios',
        component: UsersComponent,
        data: { breadcrumb: 'Gestión de Usuarios' },
      },
      {
        path: 'rutas',
        component: RoutesComponent,
        data: { breadcrumb: 'Gestión de Rutas' },
      },
      {
        path: 'ruta/:id',
        component: RouteComponent,
      },
      {
        path: 'incidents',
        component: IncidentsComponent,
        data: { breadcrumb: 'Gestión de Incidentes' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
