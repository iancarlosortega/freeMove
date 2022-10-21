import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { MaterialModule } from '../material/material.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { IncidentsComponent } from './incidents/incidents.component';
import { RoutesComponent } from './routes/routes.component';
import { UsersComponent } from './users/users.component';
import { TopHoursComponent } from './components/top-hours/top-hours.component';
import { RangeHoursComponent } from './components/range-hours/range-hours.component';
import { HeatMapComponent } from './components/heat-map/heat-map.component';
import { RecurrentIncidentsComponent } from './components/recurrent-incidents/recurrent-incidents.component';
import { RecurrentRoutesComponent } from './components/recurrent-routes/recurrent-routes.component';
import { MapFiltersComponent } from './components/map-filters/map-filters.component';

@NgModule({
  declarations: [IncidentsComponent, RoutesComponent, UsersComponent, TopHoursComponent, RangeHoursComponent, HeatMapComponent, RecurrentIncidentsComponent, RecurrentRoutesComponent, MapFiltersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DashboardModule,
    MaterialModule,
    PrimeNgModule,
  ],
})
export class AdminModule {}
