import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../material/material.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoutesComponent } from './routes/routes.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { CommunityComponent } from './community/community.component';
import { ProfileComponent } from './profile/profile.component';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    RoutesComponent,
    IncidentsComponent,
    CommunityComponent,
    ProfileComponent,
    NavComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    PrimeNgModule,
    SharedModule,
  ],
})
export class DashboardModule {}
