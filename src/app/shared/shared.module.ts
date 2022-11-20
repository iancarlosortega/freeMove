import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BarRatingModule } from 'ngx-bar-rating';
import { GalleryModule } from 'ng-gallery';
import { LightboxModule } from 'ng-gallery/lightbox';
import { MaterialModule } from '../material/material.module';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { SwiperModule } from 'swiper/angular';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { CardComponent } from './card/card.component';
import { PhotosComponent } from './photos/photos.component';
import { ShowRouteComponent } from './show-route/show-route.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

@NgModule({
  declarations: [
    BreadcrumbComponent,
    CardComponent,
    PhotosComponent,
    ShowRouteComponent,
    SideMenuComponent,
  ],
  exports: [
    BreadcrumbComponent,
    CardComponent,
    PhotosComponent,
    ShowRouteComponent,
    SideMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    BarRatingModule,
    GalleryModule,
    LightboxModule,
    MaterialModule,
    ShareButtonsModule,
    ShareIconsModule,
    SwiperModule,
  ],
})
export class SharedModule {}
