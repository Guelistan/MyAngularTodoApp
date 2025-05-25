import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdUser, contact } from './contact.model';

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
  private apiUrl = 'YOUR_API_URL_HERE'; // Ersetzen Sie dies durch Ihren tatsächlichen API-Endpunkt

  /**
   * Initialisiert den ContactService mit dem benötigten HttpClient.
   * @param http Der Angular HttpClient für HTTP-Anfragen.
   */
  constructor(private http: HttpClient) {}

  /**
   * Ruft die Liste der Kontakte von der Backend-API ab.
   * @returns Ein Observable, das ein Array von `contact`-Objekten liefert.
   */
  getContacts(): Observable<contact[]> {
    return this.http.get<contact[]>(`${this.apiUrl}/contacts`);
  }

  /**
   * Fügt einen neuen Kontakt über die Backend-API hinzu.
   * @param adUser Das `AdUser`-Objekt mit den hinzuzufügenden Kontaktinformationen.
   * @returns Ein Observable, das die Serverantwort liefert.
   */
  addContact(adUser: AdUser): Observable<any> {
    return this.http.post(`${this.apiUrl}/contacts`, adUser);
  }

  /**
   * Aktualisiert einen bestehenden Kontakt über die Backend-API.
   * @param updatedContact Das `contact`-Objekt mit den aktualisierten Informationen.
   * @returns Ein Observable, das die Serverantwort liefert.
   */
  updateContact(updatedContact: contact): Observable<any> {
    return this.http.put(`${this.apiUrl}/contacts/${updatedContact['id']}`, updatedContact);
  }
}
