import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

@NgModule({
  declarations: [NavbarComponent, FooterComponent, SideMenuComponent],
  exports: [NavbarComponent, FooterComponent, SideMenuComponent],
  imports: [CommonModule, RouterModule],
})
export class SharedModule {}
