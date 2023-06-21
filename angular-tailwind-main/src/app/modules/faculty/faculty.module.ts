import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacultyRoutingModule } from './faculty-routing.module';
import { FacultyComponent } from './faculty.component';
import { FacultyTableComponent } from './faculty-table/faculty-table.component';
import { FacultyTableItemComponent } from './faculty-table-item/faculty-table-item.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [FacultyComponent, FacultyTableComponent, FacultyTableItemComponent],
  imports: [
    CommonModule,
    FacultyRoutingModule,
    AngularSvgIconModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FileUploadModule
  ],
})
export class FacultyModule {}
