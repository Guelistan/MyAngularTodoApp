import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { AdminContactComponent } from './admin-contact/admin-contact.component';

export const routes: Routes = [
  { path: '', redirectTo: 'todo', pathMatch: 'full' },
  { path: 'todo', loadComponent: () => import('./todo/todo.component').then(m => m.TodoComponent) },
  { path: 'calendar', loadComponent: () => import('./calendar/calendar.component').then(m => m.CalendarComponent) },
  { path: 'cropper', loadComponent: () => import('./cropper-functions/cropper-functions.component').then(m => m.CropperFunctionsComponent) },
  { path: 'camera', loadComponent: () => import('./camera-functions/camera-functions.component').then(m => m.CameraFunctionsComponent) },
  { path: 'utils', loadComponent: () => import('./utils.service').then(m => m.UtilsService) },
  { path: "admin-contact", loadComponent: () => import('./admin-contact/admin-contact.component').then(m => m.AdminContactComponent) },
  { path: "ghoast", loadComponent: () => import('./ghoast-admin/ghoast-admin.component').then(m => m.GhoastAdminComponent) },
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideClientHydration(),
  ],
};
