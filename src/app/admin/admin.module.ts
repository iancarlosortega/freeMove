import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { MaterialModule } from '../material/material.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { IncidentsComponent } from './incidents/incidents.component';
import { RoutesComponent } from './routes/routes.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [IncidentsComponent, RoutesComponent, UsersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DashboardModule,
    MaterialModule,
    PrimeNgModule,
  ],
})
export class AdminModule {}
