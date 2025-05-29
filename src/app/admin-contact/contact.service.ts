import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdUser, Contact } from './contact.model';


/**
 * Service zum Verwalten von Kontakten über HTTP-Anfragen.
 *
 * Bietet Methoden zum Abrufen, Hinzufügen und Aktualisieren von Kontakten über die Backend-API.
 *
 * @bemerkung
 * Ersetzen Sie `YOUR_API_URL_HERE` durch Ihre tatsächliche API-Endpunkt-URL.
 */
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  /**
   * Die Basis-URL des API-Endpunkts.
   * @private
   */
  //API-Endpunkt für den mock-Server

  private apiUrl = 'http://localhost:3000';

  /**
   * Initialisiert den ContactService mit dem benötigten HttpClient.
   * @param http Der Angular HttpClient für HTTP-Anfragen.
   */
  constructor(private http: HttpClient) { }

  /**
   * Ruft die Liste der Kontakte von der Backend-API ab.
   * @returns Ein Observable, das ein Array von `Contact`-Objekten liefert.
   */
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/Contacts`);
  }

  /**
   * Fügt einen neuen Kontakt über die Backend-API hinzu.
   * @param adUser Das `AdUser`-Objekt mit den hinzuzufügenden Kontaktinformationen.
   * @returns Ein Observable, das die Serverantwort liefert.
   */
  addContact(adUser: AdUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/Contacts`, adUser);
  }

  /**
   * Aktualisiert einen bestehenden Kontakt über die Backend-API.
   * @param updatedContact Das `Contact`-Objekt mit den aktualisierten Informationen.
   * @returns Ein Observable, das die Serverantwort liefert.
   */
  updateContact(updatedContact: Contact): Observable<any> {
    return this.http.put(`${this.apiUrl}/Contacts/${updatedContact['id']}`, updatedContact);
  }
  deleteContact(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Contacts/${id}`);
  }

  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/Contacts/${id}`);
  }
  getContactByEmail(email: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/Contacts?email=${email}`);
  }
  getContactByName(name: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/Contacts?name=${name}`);
  }
  getContactByPhone(phone: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/Contacts?phone=${phone}`);
  }
  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/Contacts/${id}`);
  }
  getContactByDepartment(department: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/Contacts?department=${department}`);
  }
  getContactByPosition(position: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/Contacts?position=${position}`);
  }
  getContactByCompany(company: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/Contacts?company=${company}`);
  }
  getContactByLocation(location: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/Contacts?location=${location}`);
  }

}
