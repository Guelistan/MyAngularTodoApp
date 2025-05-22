import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdUser, contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'YOUR_API_URL_HERE'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) {}

  getContacts(): Observable<contact[]> {
    return this.http.get<contact[]>(`${this.apiUrl}/contacts`);
  }

  addContact(adUser: AdUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacts`, adUser);
  }

  updateContact(updatedContact: contact): Observable<any> {
    return this.http.put(`${this.apiUrl}/contacts/${updatedContact['id']}`, updatedContact);
  }
}


