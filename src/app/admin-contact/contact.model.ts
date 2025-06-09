import { fileURLToPath } from 'node:url';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminContactComponent } from './admin-contact.component';

// Definiert das Interface für einen Kontakt mit verschiedenen Feldern
export interface Contact {
  presence: unknown;
  title: any;
  phone: any;
  tel: any;
  link: any;
  description: any;
  image: any;
  displayName: any;
  identity: any;
  role: string;
  universal(identity: any, universal: any): unknown;
  admin(identity: any, admin: any): unknown;
  id: number;
  name: string;
  surname: string;
  email: string;
  telephone: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  photo: File | string;
  // Weitere Felder können bei Bedarf hinzugefügt werden
}

// Definiert das Interface für einen Benutzer aus Active Directory
export interface AdUser {
  department: any;
  identity(identity: any): unknown;
  id: number;
  name: string;
  surname: string;
  email: string;
  // Weitere Felder können bei Bedarf hinzugefügt werden
}

/**
 * Repräsentiert eine Kontakt-Entität mit persönlichen und Kontaktinformationen.
 *
 * @property {string} identity - Die eindeutige Kennung des Kontakts (subject).
 * @property {string} name - Der vollständige Name des Kontakts.
 * @property {string} email - Die E-Mail-Adresse des Kontakts.
 * @property {string} phone - Die Telefonnummer des Kontakts.
 * @property {string} address - Die Adresse des Kontakts.
 * @property {string} displayName - Der Anzeigename des Kontakts.
 * @property {string} telefon - Alias für die Telefonnummer.
 * @property {string} photo - URL oder Pfad zum Foto des Kontakts.
 * @property {string} role - Die Rolle oder Position des Kontakts.
 *
 * @constructor
 * Erstellt eine neue Kontaktinstanz.
 * @param {string} subject - Die eindeutige Kennung des Kontakts.
 * @param {string} name - Der vollständige Name des Kontakts.
 * @param {string} email - Die E-Mail-Adresse des Kontakts.
 * @param {string} phone - Die Telefonnummer des Kontakts.
 * @param {string} address - Die Adresse des Kontakts.
 * @param {string} displayName - Der Anzeigename des Kontakts.
 * @param {string} photo - URL oder Pfad zum Foto des Kontakts.
 * @param {string} role - Die Rolle oder Position des Kontakts.
 *
 * Schritte:
 * 1. Weist die Identität (subject) dem Kontakt zu.
 * 2. Setzt den Namen des Kontakts.
 * 3. Setzt die E-Mail-Adresse des Kontakts.
 * 4. Setzt die Telefonnummer des Kontakts.
 * 5. Setzt die Adresse des Kontakts.
 * 6. Setzt den Anzeigenamen des Kontakts.
 * 7. Setzt das Feld 'telefon' als Alias für die Telefonnummer.
 * 8. Setzt das Foto des Kontakts.
 * 9. Setzt die Rolle des Kontakts.
 */ export class contact {
  identity: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  displayName: string;
  telefon: string;
  photo: string;
  role: string;

  constructor(
    subject: string,
    name: string,
    email: string,
    phone: string,
    address: string,
    displayName: string,
    photo: string,
    role: string
  ) {
    this.identity = subject;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.displayName = displayName;
    this.telefon = phone;
    this.photo = photo;
    this.role = role;
  }
}

// Klasse zur Verwaltung einer Kontaktliste
export class contactList {
  contacts: contact[];
  constructor() {
    // Initialisiert die Kontaktliste als leeres Array
    this.contacts = [];
  }
  // Fügt einen Kontakt zur Liste hinzu
  addContact(contact: contact) {
    this.contacts.push(contact);
  }
  // Gibt alle Kontakte zurück
  getContacts() {
    return this.contacts;
  }
}

// Interface für ein kombiniertes Modell mit mehreren Eigenschaften
export interface combinmodel {
  name: string;
  value: string;
  subject: string;
  sector: string;
  contact: string;
}

// Klasse für ein kombiniertes Modell
export class combinemodel {
  subject: string;
  name: string;
  sector: string;
  constructor(subject: string, name: string, sector: string) {
    this.subject = subject;
    this.name = name;
    this.sector = sector;
  }
}

// Klasse für ein Kontaktmodell mit mehreren Eigenschaften
export class contactmodel {
  name: string;
  value: string;
  subject: string;
  sector: string;
  constructor(name: string, value: string, subject: string, sector: string) {
    this.name = name;
    this.value = value;
    this.subject = subject;
    this.sector = sector;
  }
}
import { ContactService } from './contact.service';
// Define newContact as a variable with the correct type annotation
const newContact: contact = new contact(
  '', // subject/identity
  '',
  '',
  '',
  '',
  '',
  '',
  ''
);

@NgModule({
  imports: [CommonModule, AdminContactComponent],
})
export class AdminContactModule { }


export interface AdUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone?: string;        // hinzufügen
  address?: string;      // hinzufügen
  photo?: string;        // hinzufügen
  link?: string;         // hinzufügen
}
