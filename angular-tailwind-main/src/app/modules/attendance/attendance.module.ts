import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceTableComponent } from './attendance-table/attendance-table.component';
import { AttendanceTableItemComponent } from './attendance-table-item/attendance-table-item.component';
import { AttedanceComponent } from './attedance.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'ng2-file-upload';


@NgModule({
  declarations: [AttendanceTableComponent, AttendanceTableItemComponent, AttedanceComponent],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    AngularSvgIconModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    FileUploadModule,
  ],
  providers: [DatePipe],
})
export class AttendanceModule {}
