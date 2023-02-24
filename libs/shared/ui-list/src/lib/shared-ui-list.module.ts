import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyPaginatorIntl as MatPaginatorIntl, MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TableComponent } from './components/table/table.component';
import { DemoMatPaginatorIntl } from './services/custom-paginator.service';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: DemoMatPaginatorIntl }],
  declarations: [TableComponent],
  exports: [TableComponent]
})
export class SharedUiListModule {}
