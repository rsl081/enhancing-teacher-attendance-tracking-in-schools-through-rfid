import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttedanceComponent } from './attedance.component';

const routes: Routes = [
  {
    path: '',
    component: AttedanceComponent,
    pathMatch: 'full',
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
