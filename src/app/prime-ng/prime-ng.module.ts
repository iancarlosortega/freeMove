import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';

@NgModule({
  exports: [
    ButtonModule,
    CalendarModule,
    DropdownModule,
    InputSwitchModule,
    InputTextModule,
    PaginatorModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    TableModule,
    ToggleButtonModule,
  ],
})
export class PrimeNgModule {}
