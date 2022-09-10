import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { SwiperModule } from 'swiper/angular';
import { MaterialModule } from '../material/material.module';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoutesComponent } from './routes/routes.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { CommunityComponent } from './community/community.component';
import { ProfileComponent } from './profile/profile.component';
import { NavComponent } from './components/nav/nav.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { RouteComponent } from './route/route.component';
import { CardComponent } from './components/card/card.component';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';
import { ConfirmAlertComponent } from './components/confirm-alert/confirm-alert.component';
import { StopAlertComponent } from './components/stop-alert/stop-alert.component';
import { LinkAccountComponent } from './link-account/link-account.component';

@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    RoutesComponent,
    IncidentsComponent,
    CommunityComponent,
    ProfileComponent,
    NavComponent,
    ChangePasswordComponent,
    ChangeEmailComponent,
    RouteComponent,
    CardComponent,
    ConfirmDeleteComponent,
    ConfirmAlertComponent,
    StopAlertComponent,
    LinkAccountComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ReactiveFormsModule,
    SwiperModule,
    MaterialModule,
    PrimeNgModule,
    SharedModule,
    ModalModule.forRoot(),
    ShareButtonsModule,
    ShareIconsModule,
  ],
})
export class DashboardModule {}
