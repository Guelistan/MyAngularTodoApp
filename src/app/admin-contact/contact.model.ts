import { fileURLToPath } from 'node:url';
export interface Contact {
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
  // Add other fields as needed
} 


export interface AdUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  // Add other fields as needed
}

export class contact {
  [x: string]: any;
  identity: string;
  name:
    string;
  email: string;
  phone:
    string;
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
export class contactList {
  contacts: contact[];
  constructor() {
    this.contacts = [];
  }
  addContact(contact: contact) {
    this.contacts.push(contact);
  }
  getContacts() {
    return this.contacts;
  }
}
export interface combinmodel {
  name: string;
  value: string;
  subject: string;
  sector: string;


  contact: string;
}

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
