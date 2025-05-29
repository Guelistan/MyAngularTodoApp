import { Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { AdminContactComponent } from './admin-contact/admin-contact.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CameraFunctionsComponent } from './camera-functions/camera-functions.component';
import { CropperFunctionsComponent } from './cropper-functions/cropper-functions.component';
import { GhoastAdminComponent } from './ghoast-admin/ghoast-admin.component';

export const routes: Routes = [
  { path: '', redirectTo: 'todo', pathMatch: 'full' },
  { path: 'todo', component: TodoComponent },
  { path: 'admin-contact', component: AdminContactComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'camera', component: CameraFunctionsComponent },
  { path: 'cropper', component: CropperFunctionsComponent },
  { path: 'ghoast', component: GhoastAdminComponent },
  { path: '**', redirectTo: 'todo' }
];
