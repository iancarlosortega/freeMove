import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouteRoutingModule } from './route-routing.module';
import { SharedModule } from '../shared/shared.module';

import { RouteComponent } from './route/route.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [RouteComponent],
  imports: [CommonModule, RouteRoutingModule, SharedModule, ComponentsModule],
})
export class RouteModule {}
