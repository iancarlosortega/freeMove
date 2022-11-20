import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouteComponent } from './route/route.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: ':id',
        component: RouteComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RouteRoutingModule {}
