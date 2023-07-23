import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FrontEndRoutingModule } from './front-end-routing.module';
import { FrontEndComponent } from './front-end/front-end.component';
import { HttpClientModule } from '@angular/common/http';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [FrontEndComponent],
  imports: [
    CommonModule,
    FrontEndRoutingModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
})
export class FrontEndModule {}
