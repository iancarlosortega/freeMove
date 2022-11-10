import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BarRatingModule } from 'ngx-bar-rating';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { MaterialModule } from '../material/material.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgChartsModule } from 'ng2-charts';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SwiperModule } from 'swiper/angular';
import { SharedModule } from '../shared/shared.module';

import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AsideComponent } from './dashboard/aside/aside.component';
import { BitacoraComponent } from './bitacora/bitacora.component';
import { CardComponent } from './components/card/card.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChartComponent } from './components/chart/chart.component';
import { ChartsComponent } from './dashboard/charts/charts.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommunityComponent } from './community/community.component';
import { CommunityComponent as DashboardCommunityComponent } from './dashboard/community/community.component';
import { ConfirmAlertComponent } from './components/confirm-alert/confirm-alert.component';
import { ConfirmDeleteComponent } from './components/confirm-delete/confirm-delete.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FiltersComponent } from './components/filters/filters.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HealthComponent } from './health/health.component';
import { IncidentComponent } from './incident/incident.component';
import { IncidentsComponent } from './incidents/incidents.component';
import { LayoutComponent } from './layout/layout.component';
import { LinkAccountComponent } from './link-account/link-account.component';
import { LinkAccountInvitationComponent } from './link-account-invitation/link-account-invitation.component';
import { NavComponent } from './components/nav/nav.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PhotosComponent } from './components/photos/photos.component';
import { PostComponent } from './components/post/post.component';
import { ProfileComponent } from './profile/profile.component';
import { RouteComponent } from './route/route.component';
import { RoutesComponent } from './routes/routes.component';
import { SearchComponent } from './search/search.component';
import { ShowRouteComponent } from './components/show-route/show-route.component';
import { SliderIncidentsComponent } from './dashboard/slider-incidents/slider-incidents.component';
import { SliderRoutesComponent } from './dashboard/slider-routes/slider-routes.component';
import { StadisticsComponent } from './components/stadistics/stadistics.component';
import { StopAlertComponent } from './components/stop-alert/stop-alert.component';
import { SuggestedComponent } from './components/suggested/suggested.component';
import { TrackingComponent } from './tracking/tracking.component';
import { UnlinkAccountComponent } from './components/unlink-account/unlink-account.component';
import { UserComponent } from './components/user/user.component';
import { HealthCardComponent } from './dashboard/aside/health-card/health-card.component';
import { StadisticsCardComponent } from './dashboard/aside/stadistics-card/stadistics-card.component';
import { FollowButtonComponent } from './components/follow-button/follow-button.component';

@NgModule({
  declarations: [
    AccountSettingsComponent,
    AsideComponent,
    BitacoraComponent,
    CardComponent,
    ChangeEmailComponent,
    ChangePasswordComponent,
    ChartComponent,
    ChartsComponent,
    CommentComponent,
    CommunityComponent,
    ConfirmAlertComponent,
    ConfirmDeleteComponent,
    DashboardCommunityComponent,
    DashboardComponent,
    FiltersComponent,
    GalleryComponent,
    HealthComponent,
    IncidentComponent,
    IncidentsComponent,
    LayoutComponent,
    LinkAccountComponent,
    LinkAccountInvitationComponent,
    NavComponent,
    NotificationsComponent,
    PhotosComponent,
    PostComponent,
    ProfileComponent,
    RouteComponent,
    RoutesComponent,
    SearchComponent,
    ShowRouteComponent,
    SliderIncidentsComponent,
    SliderRoutesComponent,
    StadisticsComponent,
    StopAlertComponent,
    SuggestedComponent,
    TrackingComponent,
    UnlinkAccountComponent,
    UserComponent,
    HealthCardComponent,
    StadisticsCardComponent,
    FollowButtonComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BarRatingModule,
    GalleryModule,
    LightboxModule,
    MaterialModule,
    ModalModule.forRoot(),
    NgChartsModule,
    PrimeNgModule,
    ShareButtonsModule,
    ShareIconsModule,
    SwiperModule,
    SharedModule,
  ],
  exports: [FiltersComponent, StadisticsComponent, ShowRouteComponent],
})
export class DashboardModule {}
