import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';

@NgModule({
  exports: [ButtonModule, InputTextModule, ProgressSpinnerModule, TableModule],
})
export class PrimeNgModule {}
