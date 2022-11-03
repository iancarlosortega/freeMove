import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { MaterialModule } from '../material/material.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { HeatMapComponent } from './routes/heat-map/heat-map.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { MapFiltersComponent } from './components/map-filters/map-filters.component';
import { RangeHoursComponent } from './routes/range-hours/range-hours.component';
import { RecurrentIncidentsComponent } from './routes/recurrent-incidents/recurrent-incidents.component';
import { RecurrentRoutesComponent } from './routes/recurrent-routes/recurrent-routes.component';
import { RoutesComponent } from './routes/routes.component';
import { TopHoursComponent } from './routes/top-hours/top-hours.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    HeatMapComponent,
    IncidentsComponent,
    MapFiltersComponent,
    RangeHoursComponent,
    RecurrentIncidentsComponent,
    RecurrentRoutesComponent,
    RoutesComponent,
    TopHoursComponent,
    UsersComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DashboardModule,
    MaterialModule,
    PrimeNgModule,
  ],
})
export class AdminModule {}
