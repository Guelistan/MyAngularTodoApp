import { Component, ElementRef, OnInit, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { RouterLink } from '@angular/router';

import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component';
import { CameraFunctionsComponent } from '../camera-functions/camera-functions.component';

import { AdUser, Contact } from './contact.model';
import { ContactService } from './contact.service';

import { Inject } from '@angular/core';

interface LocalContact {
  id: number;
  title?: string;
  description?: string;
  image?: string;
  photo?: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  link?: string;
  contactId?: number;
}

interface Card {
  id: number;
  title: string;
  description: string;
  image?: string;
  name?: string;
  address?: string;
  phone?: string;
  link?: string;
  contactId?: number;
}

/**
 * AdminContactComponent verwaltet sowohl lokale als auch service-basierte Kontakte und zugehörige Karten.
 *
 * ## Hauptfunktionen:
 * - Verwaltung von lokalen Kontakten und Karten (CRUD, Speicherung in LocalStorage)
 * - Bildaufnahme und -bearbeitung für Kontakte und Karten (Kamera, Cropper)
 * - Verwaltung von Kontakten aus dem Backend (Service-getrieben)
 * - Zuweisung und Bearbeitung von Rollen, Sektoren und Fächern für Kontakte
 * - Suche und Auswahl von Kontakten (inkl. internationaler Suche)
 * - Verwaltung von Kontakt-Zuweisungen (Assignments)
 *
 * ## Wichtige Properties:
 * - `localContacts`, `cards`: Lokale Kontakte und Karten (LocalStorage)
 * - `contacts`, `chosenContact`, `assignmentsOfContact`: Service-getriebene Kontakte und deren Zuweisungen
 * - `showCamera`, `showCropper`, `showCardCamera`, `showCardCropper`: Steuerung der Bildbearbeitungs-UI
 * - `searchResult$`, `searchName`, `searchSurname`: Kontakt-Suche
 * - `roles`, `selectedRole`: Rollenverwaltung für Kontakte
 *
 * ## Wichtige Methoden:
 * - `ngOnInit`: Initialisiert lokale Daten und lädt Service-Daten
 * - Lokale Kontakte/Karten: `saveNewContact`, `deleteLocalContact`, `editCard`, `saveEditedCard`, `saveNewCard`, `deleteCard`
 * - Bildbearbeitung: `onImageSelected`, `onCardImageSelected`, `onCameraImage`, `onCropped`, `onCardCameraImage`, `onCardCropped`
 * - Service-Kontakte: `setContacts`, `addContact`, `chooseContact`, `updateContactRole`, `updateContactPhoto`, `deleteContact`
 * - Suche: `searchContacts`, `searchKeysValid`, `resetDataForSearchModal`
 * - Zuweisungen: `checkAssignmentExist`, `setUniversal`, `setAdmin`
 *
 * ## Hinweise:
 * - Die Komponente nutzt sowohl Template-driven als auch Service-driven Ansätze.
 * - Viele Methoden sind für Drag & Drop und Bildbearbeitung ausgelegt.
 * - Die Komponente ist standalone und importiert mehrere Hilfskomponenten.
 *
 * @component
 * @example
 * <app-admin-contact></app-admin-contact>
 */
@Component({
  selector: 'app-admin-contact',
  standalone: true,
  templateUrl: './admin-contact.component.html',
  styleUrls: ['./admin-contact.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    CameraFunctionsComponent,
    CropperFunctionsComponent,
    RouterLink
  ]
})
export class AdminContactComponent implements OnInit {
  selectContact(_t46: Contact) {
    throw new Error('Method not implemented.');
  }
  // Template-driven contacts/cards (local)
  localContacts: LocalContact[] = [];
  cards: Card[] = [];
  newContact: LocalContact = this.createEmptyContact();
  newCard: Card = this.createEmptyCard();
  selectedContact?: LocalContact;
  selectedCard?: Card;
  isEditingCard = false;
  showCamera = false;
  showCropper = false;
  showNewCard = false;
  imageToEdit = '';
  croppedImage = '';
  cropShape: 'circle' | 'oval' | 'square' = 'square';

  // Camera/Cropper for cards
  imageToEditCard = '';
  croppedCardImage = '';
  showCardCamera = false;
  showCardCropper = false;
  editingCardImageId: number | null = null;

  // Service-driven contacts (backend)
  @ViewChild('imageInput', { static: false })
  imageInput!: ElementRef;
  @Input()
  contact!: Contact;
  contacts!: Contact[];
  chosenContact!: Contact;
  searchResult$!: Observable<AdUser[]>;
  searchName: string = '';
  searchSurname: string = '';
  searchValid: boolean = false;
  searchDirty: boolean = false;
  internationalSearch: boolean = false;
  searching: boolean = false;
  roles: string[] = [
    'Keine Rolle',
    'Abteilungsleitung',
    'Gruppenleitung',
    'Assistenz',
    'HR Business Partner',
    'Sachbearbeitung',
    'Zeitbeauftragte',
  ];
  selectedRole: string = '';
  imgFile!: File;
  selectedSubject: string = '';
  selectedSector: string = '';
  assignmentExist: boolean = false;
  assignment: string = '';
  assignmentList: string[] = [];
  assignmentListFiltered: string[] = [];
  assignmentListFilteredBySector: string[] = [];
  assignmentListFilteredBySubject: string[] = [];
  assignmentListFilteredBySectorAndSubject: string[] = [];
  assignmentListFilteredBySectorAndSubjectAndRole: string[] = [];
  assignmentListFilteredBySectorAndSubjectAndRoleAndRole: string[] = [];
  assignmentListFilteredBySectorAndSubjectAndRoleAndRoleAndRole: string[] = [];
  assignmentListFilteredBySectorAndSubjectAndRoleAndRoleAndRoleAndRole: string[] = [];
  assignmentListFilteredBySectorAndSubjectAndRoleAndRoleAndRoleAndRoleAndRole: string[] = [];
  showAssignments: boolean = false;
  noAssignmentFound: boolean = false;
  subjectService: any;
  subjectList: any;
  sectorService: any;
  sectorList: any;
  contactService: any;
  combinedModelService: any;
  assignmentsOfContact: any[] = [];
  miscService: any;

  ngOnInit(): void {
    this.loadCardsFromLocalStorage();
    this.setContacts();
    this.setSubjectList();
    this.setSectorList();
  }

  // ========== Local Contacts/Cards Methods ==========
  trackCardById(index: number, card: Card): number {
    return card.id;
  }

  copyLink(link: string): void {
    navigator.clipboard.writeText(link);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onCardImageDropped(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newCard.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onContactImageDropped(event: DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newContact.photo = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveNewContact(): void {
    const contact: LocalContact = {
      ...this.newContact,
      id: Date.now(),
      link: `localhost/${Date.now()}`
    };
    this.localContacts.push(contact);
    this.saveContactsToLocalStorage();

    // Automatisch eine Karte für den Kontakt anlegen
    const card: Card = {
      id: Date.now(),
      title: contact.title || contact.name || 'Kontakt',
      description: contact.description || '',
      image: contact.image || contact.photo || '',
      name: contact.name,
      address: contact.address,
      phone: contact.phone,
      link: contact.link,
      contactId: contact.id
    };
    this.cards.push(card);
    this.saveCardsToLocalStorage();

    this.resetNewContact();
  }

  deleteLocalContact(contact: LocalContact): void {
    this.localContacts = this.localContacts.filter(c => c.id !== contact.id);
    this.cards = this.cards.filter(card => card.contactId !== contact.id);
    this.saveContactsToLocalStorage();
    this.saveCardsToLocalStorage();
  }

  selectLocalContact(contact: LocalContact): void {
    this.selectedContact = contact;
  }

  private saveContactsToLocalStorage(): void {
    localStorage.setItem('contacts', JSON.stringify(this.localContacts));
  }

  private loadContactsFromLocalStorage(): void {
    const data = localStorage.getItem('contacts');
    if (data) {
      this.localContacts = JSON.parse(data);
    }
  }

  resetNewContact() {
    this.newContact = this.createEmptyContact();
  }

  private createEmptyContact(): LocalContact {
    return {
      id: 0,
      name: '',
      email: '',
      phone: '',
      address: '',
      photo: '',
      link: ''
    };
  }

  editCard(card: Card): void {
    this.selectedCard = { ...card };
    this.isEditingCard = true;
  }

  cancelEditCard(): void {
    this.selectedCard = undefined;
    this.isEditingCard = false;
    this.showCardCamera = false;
    this.showCardCropper = false;
  }

  saveEditedCard(): void {
    if (!this.selectedCard) return;
    const idx = this.cards.findIndex(c => c.id === this.selectedCard!.id);
    if (idx !== -1) {
      this.cards[idx] = { ...this.selectedCard! };
      this.saveCardsToLocalStorage();
    }
    this.cancelEditCard();
  }

  saveNewCard(): void {
    if (!this.selectedContact) {
      alert('Bitte zuerst einen Kontakt auswählen!');
      return;
    }

    const card: Card = {
      ...this.newCard,
      id: Date.now(),
      contactId: this.selectedContact.id
    };

    this.cards.push(card);
    this.saveCardsToLocalStorage();
    this.newCard = this.createEmptyCard();
    this.showNewCard = false;
  }

  deleteCard(card: Card): void {
    this.cards = this.cards.filter(c => c.id !== card.id);
    this.saveCardsToLocalStorage();
  }

  private saveCardsToLocalStorage(): void {
    localStorage.setItem('cards', JSON.stringify(this.cards));
  }

  private loadCardsFromLocalStorage(): void {
    const data = localStorage.getItem('cards');
    if (data) {
      this.cards = JSON.parse(data);
    }
  }

  private createEmptyCard(): Card {
    return {
      id: 0,
      title: '',
      description: '',
      image: '',
      contactId: 0
    };
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newContact.photo = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCardImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newCard.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCameraImage(image: string): void {
    this.imageToEdit = image;
  }

  onCropped(image: string): void {
    this.croppedImage = image;
    this.newContact.photo = image;
    this.showCropper = false;
    this.imageToEdit = '';
  }

  toggle(section: 'camera' | 'cropper'): void {
    this.showCamera = section === 'camera' ? !this.showCamera : false;
    this.showCropper = section === 'cropper' ? !this.showCropper : false;
  }

  confirmDeleteContact(contact: LocalContact): void {
    if (confirm('Möchtest du diesen Kontakt wirklich löschen?')) {
      this.deleteLocalContact(contact);
    }
  }

  confirmDeleteCard(card: Card): void {
    if (confirm('Möchtest du diese Karte wirklich löschen?')) {
      this.deleteCard(card);
    }
  }

  onCardCameraImage(image: string): void {
    this.imageToEditCard = image;
    this.showCardCropper = true;
  }

  onCardCropped(image: string): void {
    if (this.editingCardImageId !== null) {
      const card = this.cards.find(c => c.id === this.editingCardImageId);
      if (card) {
        card.image = image;
        this.saveCardsToLocalStorage();
      }
      this.editingCardImageId = null;
    } else {
      this.newCard.image = image;
    }

    this.imageToEditCard = '';
    this.showCardCropper = false;
    this.showCardCamera = false;
  }

  editCardImage(card: Card): void {
    this.imageToEditCard = card.image || '';
    this.editingCardImageId = card.id;
    this.showCardCropper = true;
  }

  onEditCardImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.selectedCard) this.selectedCard.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onEditCardImageDropped(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (this.selectedCard) this.selectedCard.image = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onEditCardCameraImage(image: string): void {
    if (this.selectedCard) this.selectedCard.image = image;
    this.showCardCamera = false;
  }

  onEditCardCropped(image: string): void {
    if (this.selectedCard) this.selectedCard.image = image;
    this.showCardCropper = false;
  }

  resetNewCard(): void {
    this.newCard = this.createEmptyCard();
  }

  goBackToCards(): void {
    this.isEditingCard = false;
    this.selectedCard = undefined;
  }

  // ========== Service-driven Contacts/Assignments Methods ==========;
  setSubjectList() {
    this.subjectService.getSubjects().subscribe((data: any) => {
      this.subjectList = data;
    });
  }
  setSectorList() {
    this.sectorService.getSectors().subscribe((data: any) => {
      this.sectorList = data;
    });
  }
  setContacts() {
    this.contactService.getAllContacts().subscribe((data: Contact[]) => {
      this.contacts = data;
      this.contacts.sort((a: Contact, b: Contact) => (a.displayName > b.displayName ? 1 : -1));
    });
  }

  addContact(adUser: AdUser) {
    this.contactService.addContact(adUser.identity).subscribe(() => {
      this.setContacts();
    });
  }
  async chooseContact(contact: Contact) {
    this.chosenContact = contact;

    await this.combinedModelService.setCombinedModels();
    this.assignmentsOfContact = [];
    this.combinedModelService
      .getCombinedModels()
      .filter((x: { contact: any; }) => x.contact == this.chosenContact.displayName)
      .forEach((x: any) => this.assignmentsOfContact.push(x));

    if (this.assignmentsOfContact.length > 0) {
      this.showAssignments = true;
    } else {
      this.noAssignmentFound = true;
    }
  }
  async updateContactRole() {
    if (!this.chosenContact) return;
    const contact = {
      identity: this.chosenContact.identity,
      role: this.selectedRole === 'Keine Rolle' ? '' : this.selectedRole
    };
    if (this.assignmentsOfContact.length > 0) {
      this.contactService.updateContactRole(contact).subscribe(() => {
        this.showAssignments = true;
        this.setContacts();
      });
    }
  }

  async updateContactPhoto() {
    if (!this.chosenContact || !this.imgFile) return;
    const contact: Contact = {
      identity: this.chosenContact.identity,
      photo: this.imgFile.name
    } as Contact;
    this.contactService.updateContactPhoto(contact).subscribe(() => {
      this.miscService.uploadPhoto(this.imgFile)?.subscribe(() => {
        this.setContacts();
      });
    });
  }

  async searchContacts() {
    if (this.searchValid) {
      this.searching = true;
      this.searchResult$ = this.contactService.searchContacts(
        this.searchName.trim().toLowerCase(),
        this.searchSurname.trim().toLowerCase(),
        this.internationalSearch
      );
    }
  }

  searchKeysValid() {
    this.searchDirty = true;
    this.searchValid = !(this.searchName === '' && this.searchSurname === '');
  }

  resetDataForSearchModal() {
    this.searchName = '';
    this.searchSurname = '';
    this.searchDirty = false;
    this.searchResult$ = of();
    this.searchValid = false;
    this.internationalSearch = false;
    this.searching = false;
  }

  resetDataForEditModal() {
    if (this.chosenContact) {
      this.selectedRole = this.chosenContact.role;
    }
    if (this.imageInput != null) {
      this.imageInput.nativeElement.value = '';
    }
    this.selectedSector = '';
    this.selectedSubject = '';
    this.showAssignments = false;
    this.noAssignmentFound = false;
    this.assignmentExist = false;
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.imgFile = target.files[0] as File;
    }
  }

  deleteContact() {
    if (!this.chosenContact) return;
    this.contactService.deleteContact(this.chosenContact.identity).subscribe(() => {
      this.setContacts();
    });
  }


  checkAssignmentExist(): boolean {
    return this.assignmentsOfContact.some(
      (x) => x.subject === this.selectedSubject && x.sector === this.selectedSector
    );
  }

  setUniversal() {
    if (!this.chosenContact) return;
    this.contactService
      .setUniversalOfContact(this.chosenContact.identity, this.chosenContact.universal)
      .subscribe();
  }

  setAdmin() {
    if (!this.chosenContact) return;
    this.contactService
      .setAdminOfContact(this.chosenContact.identity, this.chosenContact.admin)
      .subscribe();
  }

  checkContactExists({ contact }: { contact: AdUser }) {
    return !!this.contacts.find((c) => c.identity === contact.identity);
  }

  // ...Restliche Methoden wie LocalStorage, Kartenverwaltung, Bildbearbeitung etc. bleiben wie gehabt...
}

