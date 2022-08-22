import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from '../material/material.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { UsersComponent } from './users/users.component';
import { RoutesComponent } from './routes/routes.component';
import { IncidentsComponent } from './incidents/incidents.component';

@NgModule({
  declarations: [UsersComponent, RoutesComponent, IncidentsComponent],
  imports: [CommonModule, AdminRoutingModule, MaterialModule, PrimeNgModule],
})
export class AdminModule {}
