import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    SideMenuComponent,
    BreadcrumbComponent,
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    SideMenuComponent,
    BreadcrumbComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule],
})
export class SharedModule {}
