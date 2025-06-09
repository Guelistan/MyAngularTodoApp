// filepath: src/app/appconfig/app-config.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  getApiBaseUrl(): string {
    return 'http://localhost:3000/api/';
  }
}