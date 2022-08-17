import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../material/material.module';
import { SharedModule } from '../shared/shared.module';

import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoutesComponent } from './routes/routes.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { CommunityComponent } from './community/community.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    NavbarComponent,
    RoutesComponent,
    IncidentsComponent,
    CommunityComponent,
    ProfileComponent,
  ],
  imports: [CommonModule, DashboardRoutingModule, MaterialModule, SharedModule],
})
export class DashboardModule {}
