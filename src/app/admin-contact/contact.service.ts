import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AdUser, Contact } from './contact.model';
import { AppConfigService } from '../../../app.config.service';
interface ApiContactResponse {
  success: boolean;
  message: string;
}

/**
 * Service zur Verwaltung von Kontakten im Admin-Bereich.
 * 
 * Stellt Methoden für CRUD-Operationen, Suche, Filter und Attribut-Änderungen bereit.
 * Nutzt HttpClient für die Kommunikation mit dem Backend.
 * 
 * @remarks
 * - Die Basis-URL wird aus der App-Konfiguration geladen.
 * - Enthält Methoden zum Aktualisieren von Rollen, Fotos und Präsenz-Status.
 * - Bietet verschiedene Filtermöglichkeiten (z.B. nach Name, E-Mail, Abteilung).
 * - Ein Subject (`refreshContacts`) dient als Trigger für das Aktualisieren der Kontaktliste.
 * 
 * Schritte:
 * 1. Initialisierung der Basis-URL im Konstruktor.
 * 2. Standard-CRUD-Methoden: Kontakte abrufen, hinzufügen, löschen, aktualisieren.
 * 3. Suche & Filter: Kontakte nach verschiedenen Kriterien suchen.
 * 4. Attribute setzen: Universal/Admin/Präsenz-Status eines Kontakts ändern.
 * 5. Methoden zur Aktualisierung von Rolle und Foto eines Kontakts.
 * 6. Filtermethoden für spezifische Eigenschaften (E-Mail, Name, etc.).
 * 7. Refresh-Trigger: Ermöglicht das manuelle Auslösen eines Kontakt-Refreshs.
 * 
 * @example
 * // Alle Kontakte abrufen
 * contactService.getAllContacts().subscribe(contacts => { ... });
 * 
 * // Kontakt nach ID abrufen
 * contactService.getContactById(1).subscribe(contact => { ... });
 * 
 * // Kontakt hinzufügen
 * contactService.addContact('user123').subscribe(response => { ... });
 */
@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly apiBaseUrl: string;
  getRefreshInterval: number = 300000;
  public refreshContacts = new Subject<void>();

  constructor(
    private http: HttpClient,
    @Inject(AppConfigService) private appConfigService: AppConfigService
  ) {
    this.apiBaseUrl = this.appConfigService.getApiBaseUrl() + 'contact/';
  }

  // Standard-CRUD
  getAllContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiBaseUrl);
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiBaseUrl}${id}`);
  }

  addContact(identity: string): Observable<ApiContactResponse> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(identity);
    return this.http.post<ApiContactResponse>(this.apiBaseUrl + 'createContact', body, { headers });
  }

  deleteContact(identity: string): Observable<any> {
    return this.http.delete(this.apiBaseUrl + 'deleteContact?identity=' + identity);
  }

  updateContact(contact: Contact): Observable<ApiContactResponse> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(contact);
    return this.http.post<ApiContactResponse>(this.apiBaseUrl + 'updateContact', body, { headers });
  }

  // Suche & Filter
  searchContacts(name: string, surname: string, international: boolean): Observable<AdUser[]> {
    return this.http.get<AdUser[]>(
      `${this.apiBaseUrl}search?name=${name}&surname=${surname}&international=${international}`
    );
  }

  getUniversalContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiBaseUrl + 'getUniversalContacts');
  }

  getPresentContacts(): Observable<Contact[]> {
    return this.getAllContacts().pipe(map(contacts => contacts.filter(contact => contact.presence)));
  }

  // Attribute setzen
  setUniversalOfContact(identity: string, universal: boolean): Observable<boolean> {
    const params = new HttpParams()
      .append('identity', identity)
      .append('universal', universal);
    return this.http.post<boolean>(this.apiBaseUrl + 'setUniversal', '', { params });
  }

  setAdminOfContact(identity: string, admin: boolean): Observable<boolean> {
    const params = new HttpParams()
      .append('identity', identity)
      .append('admin', admin);
    return this.http.post<boolean>(this.apiBaseUrl + 'setAdmin', '', { params });
  }

  setPresenceOfContact(presence: boolean): Observable<boolean> {
    const params = new HttpParams().append('presence', presence);
    return this.http.post<boolean>(this.apiBaseUrl + 'setPresence', '', {
      params,
      withCredentials: true
    });
  }

  updateContactRole(contact: Contact): Observable<ApiContactResponse> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(contact);
    return this.http.post<ApiContactResponse>(this.apiBaseUrl + 'updateContactRole', body, { headers });
  }

  updateContactPhoto(contact: Contact): Observable<ApiContactResponse> {
    const headers = { 'content-type': 'application/json' };
    const body = JSON.stringify(contact);
    return this.http.post<ApiContactResponse>(this.apiBaseUrl + 'updateContactPhoto', body, { headers });
  }

  // Filter nach Eigenschaften (Beispiel für Email, Name, etc.)
  getContactByEmail(email: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiBaseUrl}?email=${email}`);
  }

  getContactByName(name: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiBaseUrl}?name=${name}`);
  }

  getContactByPhone(phone: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiBaseUrl}?phone=${phone}`);
  }

  getContactByDepartment(department: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiBaseUrl}?department=${department}`);
  }

  getContactByPosition(position: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiBaseUrl}?position=${position}`);
  }

  getContactByCompany(company: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiBaseUrl}?company=${company}`);
  }

  getContactByLocation(location: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiBaseUrl}?location=${location}`);
  }

  // Refresh-Trigger
  fetchPresentContacts(): void {
    this.refreshContacts.next();
  }
}
