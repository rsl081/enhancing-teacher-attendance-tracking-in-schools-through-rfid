import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: 'faculty',
    component: LayoutComponent,
    loadChildren: () => import('../faculty/faculty.module').then((m) => m.FacultyModule),
  },
  {
    path: 'attendance',
    component: LayoutComponent,
    loadChildren: () => import('../attendance/attendance.module').then((m) => m.AttendanceModule),
  },
  { path: '', redirectTo: 'attendance', pathMatch: 'full' },
  { path: '**', redirectTo: 'error/404' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
