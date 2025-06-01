import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CropperFunctionsComponent } from '../cropper-functions/cropper-functions.component';
import { CameraFunctionsComponent } from '../camera-functions/camera-functions.component';

interface Contact {
    id: number;
    name: string;
    email: string;
    photo?: string;
    phone?: string;
    address?: string;
    link?: string;
}

interface Card {
    id: number;
    title: string;
    image?: string;
    description?: string;
    contactId: number;
}

@Component({
    selector: 'app-admin-contact',
    standalone: true,
    templateUrl: './admin-contact.component.html',
    styleUrls: ['./admin-contact.component.css'],
    imports: [
        CommonModule,
        FormsModule,
        CropperFunctionsComponent,
        CameraFunctionsComponent
    ]
})
export class AdminContactComponent {
[x: string]: any;
    contacts: Contact[] = [];
    cards: Card[] = [];

    newContact: Contact = this.createEmptyContact();
    newCard: Card = this.createEmptyCard();

    selectedContact?: Contact;
    selectedCard?: Card;
    isEditingCard = false;

    showCamera = false;
    showCropper = false;
    showNewCard = false;

    imageToEdit = '';
    croppedImage = '';
    cropShape: 'circle' | 'oval' | 'square' = 'square';

    constructor() {
        this.loadContactsFromLocalStorage();
        this.loadCardsFromLocalStorage();
    }

    // ========== Kontakte ==========
    saveNewContact(): void {
        const contact: Contact = {
            ...this.newContact,
            id: Date.now(),
            link: `https://example.com/contact/${Date.now()}`
        };
        this.contacts.push(contact);
        this.saveContactsToLocalStorage();
        this.resetNewContact();
    }

    deleteContact(contact: Contact): void {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
        this.cards = this.cards.filter(card => card.contactId !== contact.id);
        this.saveContactsToLocalStorage();
        this.saveCardsToLocalStorage();
    }

    selectContact(contact: Contact): void {
        this.selectedContact = contact;
    }

    private saveContactsToLocalStorage(): void {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    private loadContactsFromLocalStorage(): void {
        const data = localStorage.getItem('contacts');
        if (data) {
            this.contacts = JSON.parse(data);
        }
    }

    private resetNewContact(): void {
        this.newContact = this.createEmptyContact();
    }

    private createEmptyContact(): Contact {
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

  // ========== Karten ==========
  editCard(card: Card): void {
    this.selectedCard = { ...card };
    this.isEditingCard = true;
  }
    cancelEditCard(): void {
        this.selectedCard = undefined;
        this.isEditingCard = false;
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

    // ========== Bildfunktionen ==========
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

    confirmDeleteContact(contact: Contact): void {
        if (confirm('Möchtest du diesen Kontakt wirklich löschen?')) {
            this.deleteContact(contact);
        }
    }

    confirmDeleteCard(card: Card): void {
        if (confirm('Möchtest du diese Karte wirklich löschen?')) {
            this.deleteCard(card);
        }
    }
}
