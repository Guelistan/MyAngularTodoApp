import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'todo', pathMatch: 'full' },
  { path: 'todo', loadComponent: () => import('./todo/todo.component').then(m => m.TodoComponent) },
  { path: 'todo/:id', loadComponent: () => import('./todo/todo.component').then(m => m.TodoComponent) },
  { path: 'cropper', loadComponent: () => import('./cropper-functions/cropper-functions.component').then(m => m.CropperFunctionsComponent) },
  { path: 'camera', loadComponent: () => import('./camera-functions/camera-functions.component').then(m => m.CameraFunctionsComponent) },
  { path: 'utils', loadComponent: () => import('./utils.service').then(m => m.UtilsService) },
  { path: 'calendar', loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent) },

];
